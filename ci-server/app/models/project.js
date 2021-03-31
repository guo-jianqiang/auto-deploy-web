const {sequelize} = require('../../core/db')
const {Sequelize, Model} = require('sequelize')

class Project extends Model {}

Project.init({
  id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING(64),
    comment: '项目名'
  },
  description: {
    type: Sequelize.STRING(64),
    comment: '项目描述',
  },
  status: {
    type: Sequelize.INTEGER,
    comment: '状态'
  },
  visibility: {
    allowNull: false,
    type: Sequelize.STRING,
    comment: '项目权限'
  },
  httpUrl: {
    type: Sequelize.STRING,
    comment: '项目地址'
  },
  sshUrl:{
    type: Sequelize.STRING,
    comment: 'ssh地址'
  }
}, {
  sequelize,
  modelName: 'project',
  tableName: 'project'
})

module.exports = {
  Project
}