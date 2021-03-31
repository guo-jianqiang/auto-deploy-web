const {sequelize} = require('../../core/db')
const {Sequelize, Model} = require('sequelize')

class Log extends Model {}

Log.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  logFileName: {
    allowNull: false,
    type: Sequelize.STRING,
    comment: '日志名'
  },
  env: {
    type: Sequelize.STRING,
    comment: '环境'
  },
  status: {
    type: Sequelize.INTEGER,
    comment: '日志状态'
  },
  projectId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    comment: '项目id'
  }
}, {
  sequelize,
  modelName: 'log',
  tableName: 'log'
})

module.exports = {
  Log
}