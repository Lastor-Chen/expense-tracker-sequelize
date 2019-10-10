'use strict';

const users = require('./users.json')
const records = require('./records.json')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 載入 users
    users.forEach(user => {
      user.password = bcrypt.hashSync(user.password, 10)
    })

    await queryInterface.bulkInsert('users', users)
    const userTable = await queryInterface.sequelize.query('SELECT id from users;')    
    const userRows = userTable[0]

    // 載入 records
    records.forEach(record => {
      if (record.userId === 0) record.userId = userRows[0].id
      if (record.userId === 1) record.userId = userRows[1].id
    })

    return await queryInterface.bulkInsert('records', records)
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('users', null),
      queryInterface.bulkDelete('records', null),
    ])
  }
};
