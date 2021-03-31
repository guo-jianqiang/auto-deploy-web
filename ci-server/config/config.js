module.exports = {
  port: 3000,
  environment: process.env.NODE_ENV || 'development',
  prefix: '/api/v1',
  database: {
    dbName: 'ci',
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'admin123'
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60
  },
  ssh_server: {
    host: '121.36.56.84',
    port: 22,
    username: 'root'
  },
  // 日志存放目录
  log_dir: '/logs',
  // 项目打包文件目录
  project_dir: '/projects',
  // nginx配置地址
  deploy_dir: {
    dev: '/web/dev',
    test: '/web/test',
    prod: '/web/prod'
  },
  upload_file: '/public/upload-file'
}
