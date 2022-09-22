'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avatarKey', {
      type: Sequelize.STRING,
      allowNull: false,
    })
    await queryInterface.addColumn('users', 'avatarUrl', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatarKey')
    await queryInterface.removeColumn('users', 'avatarUrl')
  }
};
