'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'resetPassword', {
      type: Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'resetPassword', {
      type: Sequelize.JSON,
    })
  }
};
