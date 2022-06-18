'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('institution', 'bimDates', {
      type: Sequelize.JSON,
      allowNull: false,
    }, {
      after: 'courses'
    })
    await queryInterface.addColumn('schoolcalls', 'bimester', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'classTheme'
    })

    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_1')
    await queryInterface.removeColumn('bulletin', 'idStudent')
    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_3')
    await queryInterface.removeColumn('bulletin', 'idClass')

    await queryInterface.addColumn('bulletin', 'idStudentClasses', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'id'
    })
    await queryInterface.addConstraint('bulletin', {
      fields: ['idStudentClasses'],
      type: 'foreign key',
      name: 'bulletin_ibfk_1',
      references: { //Required field
        table: 'studentclasses',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('institution', 'bimDates')
    await queryInterface.removeColumn('schoolcalls', 'bimester')

    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_1')
    await queryInterface.removeColumn('bulletin', 'idStudentClasses')

    await queryInterface.addColumn('bulletin', 'idStudent', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'id'
    })
    await queryInterface.addConstraint('bulletin', {
      fields: ['idStudent'],
      type: 'foreign key',
      name: 'bulletin_ibfk_1',
      references: { //Required field
        table: 'student',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addColumn('bulletin', 'idClass', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'idTeacher'
    })
    await queryInterface.addConstraint('bulletin', {
      fields: ['idClass'],
      type: 'foreign key',
      name: 'bulletin_ibfk_3',
      references: { //Required field
        table: 'class',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  }
};
