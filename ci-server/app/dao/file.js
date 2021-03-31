const {File} = require('../models/file')
const {DEFAULT_LIMIT} = require('../../constant/common')

class FileDao {
  static async create (record) {
    return File.create(record, {
      fields: ['id', 'originFilename','env','filename',, 'ext', 'mineType', 'size','projectId']
    });
  }

  static async get (id) {
    return File.findOne({
      where: {
        id
      }
    })
  }

  static async getAll (projectId, limit, current) {
    console.log(current)
    const { count: total, rows: list } = await File.findAndCountAll({
      where: {
        projectId
      },
      limit,
      offset: (current - 1) * limit
    })
    return {total, list}
  }
}

module.exports = {
  FileDao
}