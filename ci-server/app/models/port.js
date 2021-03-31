const {sequelize} = require('../../core/db')
const {Sequelize, Model} = require('sequelize')

class Port extends Model {}

Port.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  env: {
    allowNull: false,
    type: Sequelize.STRING(64),
    comment: '项目名'
  },
  port: {
    allowNull: false,
    type: Sequelize.INTEGER,
    comment: '部署端口'
  },
  projectId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    comment: '项目id'
  }
}, {
  sequelize,
  modelName: 'port',
  tableName: 'port'
})

module.exports = {
  Port
}