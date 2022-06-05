'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('schoolcalls', 'gang',  {
      type: Sequelize.STRING,
      allowNull: false,
    }, {
      after: 'classTheme'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('schoolcalls', 'gang')
  }
};
