'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('students', 'students_ibfk_1')
    await queryInterface.removeColumn('students', 'idClass')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('students', 'idClass', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'idUser'
    })
    await queryInterface.addConstraint('students', {
      fields: ['idClass'],
      type: 'foreign key',
      name: 'students_ibfk_1',
      references: { //Required field
        table: 'class',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  }
};
