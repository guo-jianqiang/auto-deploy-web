const Router = require('koa-router')
const fs = require('fs')
const {DEFAULT_LIMIT, logStatus} = require('../../../constant/common')
const {
  LogDao
} = require('../../dao/log')
const config = require('../../../config/config')
const {
  Resolve,
  getPath
} = require('../../lib/helper');
const res = new Resolve()

const router = new Router({
  prefix: `${config.prefix}`
})

router.get('/project/logs/:id', async ctx => {
  const {
    id
  } = ctx.request.params
  const log = await LogDao.get(id)
  if (log) {
    const {logFileName} = log.dataValues
    const text = fs.readFileSync(getPath(`${config.log_dir}/${logFileName}.txt`)).toString()
    ctx.response.status = 200
    ctx.body = res.json(text)
  } else {
    ctx.response.status = 404
  }
})

router.get('/project/logs', async ctx => {
  const {
    projectId,
    limit = DEFAULT_LIMIT,
    current = 1
  } = ctx.request.query
  let logs = await LogDao.getAll(projectId, Number(limit), Number(current))
  console.log(logs)
  logs.list = logs.list.map(item => ({...item.dataValues, statusText: logStatus[item.dataValues.status] && logStatus[item.dataValues.status].text}))
  ctx.response.status = 200;
  ctx.body = res.json(logs)
})

module.exports = router