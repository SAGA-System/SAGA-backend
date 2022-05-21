'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('students', 'frequency')
    await queryInterface.removeColumn('students', 'gang')
    await queryInterface.addColumn('studentclasses', 'frequency', {
      type: Sequelize.JSON,
      allowNull: false,
    }, {
      after: 'gang'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('studentclasses', 'frequency')
    await queryInterface.addColumn('students', 'gang', {
      type: Sequelize.STRING,
      allowNull: false,
    }, {
      after: 'situation'
    })
    await queryInterface.addColumn('students', 'frequency', {
      type: Sequelize.JSON,
      allowNull: false,
    }, {
      after: 'gang'
    })
  }
};
