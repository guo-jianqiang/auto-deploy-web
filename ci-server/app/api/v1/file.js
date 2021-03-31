const Router = require('koa-router')
const fs = require('fs')
const {DEFAULT_LIMIT} = require('../../../constant/common')
const {
  FileDao
} = require('../../dao/file')
const config = require('../../../config/config')
const {
  Resolve,
  getPath
} = require('../../lib/helper');
const res = new Resolve();

const router = new Router({
  prefix: `${config.prefix}`
})

router.get('/project/files/:id', async ctx => {
  const {
    id
  } = ctx.request.params
  const file = await FileDao.get(id)
  if (file) {
    const {filename, ext} = file.dataValues
    ctx.set('Content-Type', 'application/x-zip')
    ctx.set('Content-Disposition', `attachment; filename=${filename}${ext}`)
    ctx.body = fs.createReadStream(getPath(`/projects/${filename}${ext}`))
  } else {
    ctx.response.status = 404
  }
})

router.get('/project/files', async ctx => {
  const {
    projectId,
    limit = DEFAULT_LIMIT,
    current = 1
  } = ctx.request.query
  const files = await FileDao.getAll(projectId, Number(limit), Number(current))
  ctx.response.status = 200;
  ctx.body = res.json(files)
})

module.exports = router