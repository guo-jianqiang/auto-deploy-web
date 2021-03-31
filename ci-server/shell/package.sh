#!/bin/bash

originProjectName=$1
projectName=$2
dir=$3
user=$4
host=$5
deployDir=$6
env=$7
cd ${dir}
# 安装依赖 打包
npm i
if [ -z "${env}"]
then
  npm run build
else
  npm run build:${env}
fi
cp -r dist ../${projectName}
cd ..
# 创建部署目录
ssh ${user}@${host} "mkdir -p ${deployDir}"
# 传输文件
scp -r ${projectName} ${user}@${host}:${deployDir}/
# 建立软链接
ssh ${user}@${host} "ln -snf ${deployDir}/${projectName} ${deployDir}/${originProjectName}"
# 打包删除 源代码
zip -r ${projectName}.zip ${projectName}
rm -rf ${originProjectName} ${projectName}


