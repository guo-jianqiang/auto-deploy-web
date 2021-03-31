const {Project} = require('../models/project')
const {Op} = require('sequelize')

class ProjectDao {
  static async create (record) {
    return Project.create(record, {
      fields: ['id','name', 'description', 'visibility', 'httpUrl', 'sshUrl']
    });
  }

  static async findOne (name) {
    return Project.findOne({
      where: {
        name
      }
    })
  }

  static async getAll (params = {}) {
    const {name, ...otherParams} = params
    const where = {
      ...otherParams,
      name: {
        [Op.like]: `%${name}%`
      }
    }
    if (!name) delete where['name']
    return Project.findAll({
      where
    })
  }

  static async putProject (id, body) {
    return Project.update(body, {
      fields: ['status', 'description'],
      where: {
        id
      },
      returning: true,
      plain: true
    })
  }
}

module.exports = {
  ProjectDao
}