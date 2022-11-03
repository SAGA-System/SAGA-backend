'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'genre', {
      type: Sequelize.STRING,
      allowNull: false,
    })

    await queryInterface.addColumn('users', 'birthDate', {
      type: Sequelize.DATE,
      allowNull: false,
    })

    await queryInterface.addColumn('users', 'CEP', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'genre')
    await queryInterface.removeColumn('users', 'birthDate')
    await queryInterface.removeColumn('users', 'CEP')
  }
};
