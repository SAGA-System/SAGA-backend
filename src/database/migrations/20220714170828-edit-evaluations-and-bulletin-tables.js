'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('bulletin', 'idInstitution', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'id'
    })

    await queryInterface.addColumn('bulletin', 'classTheme', {
      type: Sequelize.STRING,
      allowNull: false,
    }, {
      after: 'id'
    })

    await queryInterface.addConstraint('bulletin', {
      fields: ['idInstitution'],
      type: 'foreign key',
      name: 'bulletin_ibfk_3',
      references: { //Required field
        table: 'institution',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.removeColumn('bulletin', 'evaluations1Bim')
    await queryInterface.removeColumn('bulletin', 'evaluations2Bim')
    await queryInterface.removeColumn('bulletin', 'evaluations3Bim')
    await queryInterface.removeColumn('bulletin', 'evaluations4Bim')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('bulletin', 'bulletin_ibfk_3')
    await queryInterface.removeColumn('bulletin', 'idInstitution')
    await queryInterface.removeColumn('bulletin', 'classTheme')

    await queryInterface.addColumn('bulletin', 'evaluations1Bim', {
      type: Sequelize.JSON,
      allowNull: true,
    }, {
      after: 'grade1Bim'
    })
    await queryInterface.addColumn('bulletin', 'evaluations2Bim', {
      type: Sequelize.JSON,
      allowNull: true,
    }, {
      after: 'grade2Bim'
    })
    await queryInterface.addColumn('bulletin', 'evaluations3Bim', {
      type: Sequelize.JSON,
      allowNull: true,
    }, {
      after: 'grade3Bim'
    })
    await queryInterface.addColumn('bulletin', 'evaluations4Bim', {
      type: Sequelize.JSON,
      allowNull: true,
    }, {
      after: 'grade4Bim'
    })
  }
};
