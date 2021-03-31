const Koa = require('koa')
const fs = require('fs')
const url = require('url')
const InitManager = require('./core/init')
const formidable = require('koa2-formidable')
const parser = require('koa-bodyparser')
const cors = require('@koa/cors')
const koaStatic = require('koa-static')
const WebSocket = require('ws')

const catchError = require('./middlewares/exception')

const {upload_file, port, project_dir, log_dir} = require('./config/config')

// 启动创建文件上传目录
const fileUploadPath = process.cwd() + upload_file
fs.mkdir(fileUploadPath, { recursive: true }, (err) => {
  if (err) throw err;
});
// 启动创建项目存储目录
const projectDir = process.cwd() + project_dir
fs.mkdir(projectDir, { recursive: true }, (err) => {
  if (err) throw err;
})
// 启动创建日志目录
const logDir = process.cwd() + log_dir
fs.mkdir(logDir, { recursive: true }, (err) => {
  if (err) throw err;
})

const app = new Koa()
const corsConfig = {
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 600,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}

app.use(catchError)
app.use(cors({corsConfig}))
app.use(formidable()).use(parser())
app.use(koaStatic(__dirname + '/public'))

InitManager.initCore(app)

const server = app.listen(port)

const socketMap = {}

const wss = new WebSocket.Server({ server })

app.wss = wss

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function connection(client, req) {
  const location = url.parse(req.url, true)
  const id = location.query.id
  socketMap[id] = client
  client.on('close', function clear() {
    delete socketMap[id]
  })
  client.isAlive = true
  client.on('pong', heartbeat)
})

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(client) {
    if (client.isAlive === false) return client.terminate();

    client.isAlive = false;
    client.ping(noop);
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(interval);
});

app.sendMessage = (data, to) => {
  if (socketMap[to] && socketMap[to].readyState === WebSocket.OPEN) {
    socketMap[to].send(data)
  } else {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  }
}

module.exports = app