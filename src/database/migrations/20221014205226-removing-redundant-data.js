'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('class', 'lessons')
    await queryInterface.removeColumn('class', 'teachers')
    await queryInterface.removeColumn('class', 'students')
    await queryInterface.removeColumn('teachers', 'lessons')
    await queryInterface.removeColumn('studentclasses', 'frequency')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('class', 'lessons', {
      type: Sequelize.JSON,
      allowNull: false,
    })
    await queryInterface.addColumn('class', 'teachers', {
      type: Sequelize.JSON,
      allowNull: false,
    })
    await queryInterface.addColumn('class', 'students', {
      type: Sequelize.JSON,
      allowNull: false,
    })
    await queryInterface.addColumn('teachers', 'lessons', {
      type: Sequelize.JSON,
      allowNull: false,
    })
    await queryInterface.addColumn('studentclasses', 'frequency', {
      type: Sequelize.JSON,
      allowNull: false,
    })
  }
};
