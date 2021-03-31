const {Port} = require('../models/port')
const {DEFAULT_LIMIT} = require('../../constant/common')

class PortDao {
  static async bulkCreate (ports) {
    return Port.bulkCreate(ports, {
      fields: ['id', 'port','env','projectId'],
      individualHooks: true,
      returning: true,
      updateOnDuplicate: ['port', 'env']
    });
  }

  // static async update (record) {
  //   return Port.update(record, {
  //     fields: ['port', '']
  //   })
  // }

  static async getAll () {
    return await Port.findAll()
  }
}

module.exports = {
  PortDao
}