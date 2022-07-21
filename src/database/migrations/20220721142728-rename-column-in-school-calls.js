'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')

    await queryInterface.removeConstraint('schoolcalls', 'schoolcalls_ibfk_1')

    await queryInterface.renameColumn("schoolcalls", "idUser", "idTeacher")

    await queryInterface.addConstraint('schoolcalls', {
      fields: ['idTeacher'],
      type: 'foreign key',
      name: 'schoolcalls_ibfk_1',
      references: { //Required field
        table: 'teachers',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')

    await queryInterface.removeConstraint('schoolcalls', 'schoolcalls_ibfk_1')

    await queryInterface.renameColumn("schoolcalls", "idTeacher", "idUser")

    await queryInterface.addConstraint('schoolcalls', {
      fields: ['idUser'],
      type: 'foreign key',
      name: 'schoolcalls_ibfk_1',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  }
};
