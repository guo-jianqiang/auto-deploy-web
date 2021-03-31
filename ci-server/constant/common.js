
const branchMap = {
  dev: 'dev',
  test: 'test',
  prod: 'master'
}

const logStatus = [
  {
    code: 0,
    text: '生成失败'
  },
  {
    code: 1,
    text: '生成中'
  },
  {
    code: 2,
    text: '已生成'
  },
]

module.exports = {
  DEFAULT_LIMIT: 20,
  FILE_SERVER: 'http://localhost:3000/upload-file/',
  UPLOAD_PATH: '/public/upload-file/',
  branchMap,
  logStatus
}
