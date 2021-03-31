const {Log} = require('../models/log')
const {DEFAULT_LIMIT} = require('../../constant/common')

class LogDao {
  static async create (ports) {
    return Log.create(ports, {
      fields: ['id', 'logFileName','projectId', 'env', 'status']
    });
  }

  static async get (id) {
    return Log.findOne({
      where: {
        id
      }
    })
  }

  static async getAll (projectId, limit, current) {
    const { count: total, rows: list } = await Log.findAndCountAll({
      where: {
        projectId
      },
      limit,
      order: [['created_time','DESC']],
      offset: (current - 1) * limit
    })
    return {total, list}
  }

  static async updateStatus (id, status) {
    return Log.update({status}, {
      fields: ['status'],
      where: id
    })
  }
}

module.exports = {
  LogDao
}