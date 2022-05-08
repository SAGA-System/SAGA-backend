'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_1')
    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_2')
    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_3')
    await queryInterface.removeConstraint('class', 'class_ibfk_1')
    await queryInterface.removeConstraint('evaluation', 'evaluation_ibfk_1')
    await queryInterface.removeConstraint('evaluation', 'evaluation_ibfk_2')
    await queryInterface.removeConstraint('files', 'files_ibfk_1')
    await queryInterface.removeConstraint('students', 'students_ibfk_1')
    await queryInterface.removeConstraint('students', 'students_ibfk_2')
    await queryInterface.removeConstraint('teachers', 'teachers_ibfk_1')
    await queryInterface.removeConstraint('userpermissions', 'userpermissions_ibfk_1')
    await queryInterface.removeConstraint('userpermissions', 'userpermissions_ibfk_2')
    await queryInterface.removeConstraint('users', 'users_ibfk_1')
    await queryInterface.addConstraint('bulletin', {
      fields: ['idStudent'],
      type: 'foreign key',
      name: 'bulletin_ibfk_1',
      references: { //Required field
        table: 'students',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('bulletin', {
      fields: ['idTeacher'],
      type: 'foreign key',
      name: 'bulletin_ibfk_2',
      references: { //Required field
        table: 'teachers',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
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
    await queryInterface.addConstraint('class', {
      fields: ['idInstitution'],
      type: 'foreign key',
      name: 'class_ibfk_1',
      references: { //Required field
        table: 'institution',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('evaluation', {
      fields: ['idClass'],
      type: 'foreign key',
      name: 'evaluation_ibfk_1',
      references: { //Required field
        table: 'class',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('evaluation', {
      fields: ['idTeacher'],
      type: 'foreign key',
      name: 'evaluation_ibfk_2',
      references: { //Required field
        table: 'teachers',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('files', {
      fields: ['idUser'],
      type: 'foreign key',
      name: 'files_ibfk_1',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('students', {
      fields: ['idUser'],
      type: 'foreign key',
      name: 'students_ibfk_1',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('students', {
      fields: ['idClass'],
      type: 'foreign key',
      name: 'students_ibfk_2',
      references: { //Required field
        table: 'class',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('teachers', {
      fields: ['idUser'],
      type: 'foreign key',
      name: 'teachers_ibfk_1',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('userpermissions', {
      fields: ['idUser'],
      type: 'foreign key',
      name: 'userpermissions_ibfk_1',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('userpermissions', {
      fields: ['idPermissions'],
      type: 'foreign key',
      name: 'userpermissions_ibfk_2',
      references: { //Required field
        table: 'permissions',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('users', {
      fields: ['idInstitution'],
      type: 'foreign key',
      name: 'users_ibfk_1',
      references: { //Required field
        table: 'institution',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_1')
    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_2')
    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_3')
    await queryInterface.removeConstraint('class', 'class_ibfk_1')
    await queryInterface.removeConstraint('evaluation', 'evaluation_ibfk_1')
    await queryInterface.removeConstraint('evaluation', 'evaluation_ibfk_2')
    await queryInterface.removeConstraint('files', 'files_ibfk_1')
    await queryInterface.removeConstraint('students', 'students_ibfk_1')
    await queryInterface.removeConstraint('students', 'students_ibfk_2')
    await queryInterface.removeConstraint('teachers', 'teachers_ibfk_1')
    await queryInterface.removeConstraint('userpermissions', 'userpermissions_ibfk_1')
    await queryInterface.removeConstraint('userpermissions', 'userpermissions_ibfk_2')
    await queryInterface.removeConstraint('users', 'users_ibfk_1')
    await queryInterface.addConstraint('bulletin', {
      fields: ['idStudent'],
      type: 'foreign key',
      name: 'bulletin_ibfk_1',
      references: { //Required field
        table: 'students',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('bulletin', {
      fields: ['idTeacher'],
      type: 'foreign key',
      name: 'bulletin_ibfk_2',
      references: { //Required field
        table: 'teachers',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('bulletin', {
      fields: ['idClass'],
      type: 'foreign key',
      name: 'bulletin_ibfk_3',
      references: { //Required field
        table: 'class',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('class', {
      fields: ['idInstitution'],
      type: 'foreign key',
      name: 'class_ibfk_1',
      references: { //Required field
        table: 'institution',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('evaluation', {
      fields: ['idClass'],
      type: 'foreign key',
      name: 'evaluation_ibfk_1',
      references: { //Required field
        table: 'class',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('evaluation', {
      fields: ['idTeacher'],
      type: 'foreign key',
      name: 'evaluation_ibfk_2',
      references: { //Required field
        table: 'teachers',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('files', {
      fields: ['idUser'],
      type: 'foreign key',
      name: 'files_ibfk_1',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('students', {
      fields: ['idUser'],
      type: 'foreign key',
      name: 'students_ibfk_1',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('students', {
      fields: ['idClass'],
      type: 'foreign key',
      name: 'students_ibfk_2',
      references: { //Required field
        table: 'class',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('teachers', {
      fields: ['idUser'],
      type: 'foreign key',
      name: 'teachers_ibfk_1',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('userpermissions', {
      fields: ['idUser'],
      type: 'foreign key',
      name: 'userpermissions_ibfk_1',
      references: { //Required field
        table: 'users',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('userpermissions', {
      fields: ['idPermissions'],
      type: 'foreign key',
      name: 'userpermissions_ibfk_2',
      references: { //Required field
        table: 'permissions',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('users', {
      fields: ['idInstitution'],
      type: 'foreign key',
      name: 'users_ibfk_1',
      references: { //Required field
        table: 'institution',
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    });
  }
};
