function getIPAddress(){
  const interfaces = require('os').networkInterfaces();
  for(let devName in interfaces){
    const iface = interfaces[devName];
    for(let i=0;i<iface.length;i++){
      let alias = iface[i];
      if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
        return alias.address;
      }
    }
  }
}

const LOCAL_IP = getIPAddress()

module.exports = LOCAL_IP