'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'resetPassword', {
      type: Sequelize.JSON,
      allowNull: true,
    }, {
      after: 'password'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'resetPassword')
  }
};
