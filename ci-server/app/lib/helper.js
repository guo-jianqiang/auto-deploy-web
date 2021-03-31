const path = require('path')
class Resolve {
  success(msg = 'success', errorCode = 0, code = 200) {
    return {
      msg,
      code,
      errorCode
    }
  }

  json(data, msg = 'success', errorCode = 0, code = 200) {
    return {
      code,
      msg,
      errorCode,
      data
    }
  }
  socketMsg(msg = '', code = 2) {
    return JSON.stringify({
      code,
      msg
    })
  }
}
// 0 部署失败 1 部署中 2 部署成功
function getPath (dir) {
  return path.join(process.cwd(), dir)
}

module.exports = {
  Resolve,
  getPath
}
