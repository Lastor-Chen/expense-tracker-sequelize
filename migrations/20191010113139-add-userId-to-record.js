'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('records', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'users',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('records', 'userId')
  }
};
