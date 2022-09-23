'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avatarKey', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatarKey')
  }
};
