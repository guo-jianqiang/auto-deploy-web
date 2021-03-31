const {sequelize} = require('../../core/db')
const {DataTypes, Model} = require('sequelize')

class File extends Model {}

File.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  originFilename: {
    type: DataTypes.STRING,
    comment: '原文件名'
  },
  filename: {
    allowNull: false,
    type: DataTypes.STRING,
    comment: '文件名'
  },
  env: {
    allowNull: false,
    type: DataTypes.STRING,
    comment: '环境'
  },
  ext: {
    type: DataTypes.STRING,
    comment: '文件扩展名'
  },
  size: {
    type: DataTypes.INTEGER,
    comment: '文件大小'
  },
  projectId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    comment: '项目id'
  }
}, {
  sequelize,
  modelName: 'file',
  tableName: 'file'
})

module.exports = {
  File
}