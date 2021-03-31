const Router = require('koa-router')
const fs = require('fs')
const {
  v4: uuidv4
} = require('uuid')
const {
  ProjectDao
} = require('../../dao/project')
const {
  FileDao
} = require('../../dao/file')
const {
  PortDao
} = require('../../dao/port')
const {
  LogDao
} = require('../../dao/log')
const config = require('../../../config/config')
const {
  Resolve,
  getPath
} = require('../../lib/helper');
const {branchMap, logStatus} = require('../../../constant/common')
const {
  exec,
  spawnSync,
  spawn
} = require("child_process")

const res = new Resolve();

const router = new Router({
  prefix: `${config.prefix}`
})

router.get('/project', async (ctx) => {
  const {
    query
  } = ctx.request
  let projects = await ProjectDao.getAll(query)
  const ports = await PortDao.getAll()
  projects.forEach(item => {
    const projectPorts = ports.filter(port => port.dataValues.projectId == item.dataValues.id)
    item.dataValues.ports = projectPorts
  })
  projects = projects.map(item => ({
    ...item.dataValues,
    deploy_host: config.ssh_server.host
  }))
  ctx.response.status = 200;
  ctx.body = res.json(projects)
})

router.put('/project/:id', async ctx => {
  const {id} = ctx.request.params
  const {body} = ctx.request
  const {ports, ...otherBody} = body
  if (Array.isArray(ports)) {
    ports.forEach(item => {
      item.projectId = id
    })
  }
  await ProjectDao.putProject(id, otherBody)
  await PortDao.bulkCreate(ports)
  for (let item of ports) {
    spawnSync('./nginx.sh', [
      otherBody.name,
      item.port,
      config.ssh_server.username,
      config.ssh_server.host,
      config.deploy_dir[item.env],
      item.env
    ], {
      cwd: getPath('/shell')
    })
  }
  ctx.body = res.json({}, '修改成功')
})

router.post('/project', async (ctx) => {
  const {
    body
  } = ctx.request
  let {
    name,
    ports
  } = body
  const queryProject = await ProjectDao.findOne(name)
  if (queryProject) {
    throw new global.errs.Existing()
  }
  for (let item of ports) {
    spawnSync('./nginx.sh', [
      name,
      item.port,
      config.ssh_server.username,
      config.ssh_server.host,
      config.deploy_dir[item.env],
      item.env
    ], {
      cwd: getPath('/shell')
    })
  }
  const project = await ProjectDao.create(body)
  ports = ports.map(item => ({
    ...item,
    projectId: project.dataValues.id
  }))
  await PortDao.bulkCreate(ports)
  ctx.response.status = 200;
  ctx.body = res.json(project);
})

router.post('/project/deploy', async ctx => {
  const {
    sshUrl,
    env = 'dev',
    id
  } = ctx.request.body
  ctx.response.status = 200;
  
  await ProjectDao.putProject(id, {
    status: 1
  })
  ctx.body = res.json({}, '开始部署');
  const logFileName = id + '-' + uuidv4()
  const logInstance = await LogDao.create({logFileName, projectId: id, env, status: logStatus[1].code})
  ctx.app.sendMessage(res.socketMsg('开始部署', code = 1), id)
  const gitClone = spawn('git', [
    'clone',
    '-b',
    branchMap[env],
    sshUrl
  ], {
    cwd: getPath('/projects')
  })
  gitClone.stderr.on('data', (data) => {
    // console.log(`stderr: ${data}`);
    // ctx.app.sendMessage(res.socketMsg(data.toString(), code = 1), id)
  });
  gitClone.on('close', (code) => {
    console.log(`=====start deploy=====`);
    const originProjectName = /\/(.*)\.git$/.exec(sshUrl)[1]
    const projectName = originProjectName + '-' + uuidv4()
    const takePackage = spawn('./package.sh', [
      originProjectName,
      projectName,
      getPath(`/projects/${originProjectName}`),
      config.ssh_server.username,
      config.ssh_server.host,
      config.deploy_dir[env],
      env
    ], {
      cwd: getPath('/shell')
    })
    takePackage.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
      exec(`echo "${data}" >> ${logFileName}.txt`, {
        cwd: getPath('/logs')
      })
    });
    takePackage.stdout.on('data', (data) => {
      exec(`echo "${data}" >> ${logFileName}.txt`, {
        cwd: getPath('/logs')
      })
      // ctx.app.sendMessage(res.socketMsg(data.toString(), code = 1), id)
    });
    takePackage.on('close', async code => {
      if (fs.existsSync(getPath(`/projects/${projectName}.zip`))) {
        await ProjectDao.putProject(id, {
          status: 2
        })
        ctx.app.sendMessage(res.socketMsg('部署成功', code = 2), id)
        const pkgZip = fs.statSync(getPath(`/projects/${projectName}.zip`))
        await FileDao.create({
          originFilename: originProjectName,
          filename: projectName,
          env,
          projectId: id,
          size: pkgZip.size,
          ext: '.zip'
        })
      } else {
        await ProjectDao.putProject(id, {
          status: 0
        })
        ctx.app.sendMessage(res.socketMsg('部署失败', code = 0), id)
      }
      await LogDao.updateStatus(logInstance.dataValues.id, logStatus[2].code)
    })
  })
})

module.exports = router