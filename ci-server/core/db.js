const Sequelize = require('sequelize')

const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: false,
  timezone: '+08:00',
  define: {
    // create_time && update_time
    timestamps: true,
    // delete_time
    paranoid: true,
    createdAt: 'createdTime',
    updatedAt: 'updatedTime',
    deletedAt: 'deletedTime',
    // 把驼峰命名转换为下划线
    underscored: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ['password', 'updatedTime', 'deletedTime', 'createdTime']
        }
      },
      iv: {
        attributes: {
          exclude: ['content', 'password', 'updatedTime', 'deletedTime']
        }
      }
    }
  }
})

sequelize.sync({ force: false })
module.exports = {
  sequelize
}
