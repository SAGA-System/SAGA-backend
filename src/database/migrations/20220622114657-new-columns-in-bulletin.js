'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
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

    await queryInterface.removeColumn('bulletin', 'totalClasses')
    await queryInterface.removeColumn('bulletin', 'classesGiven')
    await queryInterface.removeColumn('bulletin', 'absence')
    await queryInterface.removeColumn('bulletin', 'frequency')

    await queryInterface.addColumn('bulletin', 'totalClasses', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, {
      after: 'evaluations4Bim'
    })
    await queryInterface.addColumn('bulletin', 'classesGiven', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, {
      after: 'totalClasses'
    })
    await queryInterface.addColumn('bulletin', 'absence', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, {
      after: 'classesGiven'
    })
    await queryInterface.addColumn('bulletin', 'frequency', {
      type: Sequelize.DECIMAL,
      allowNull: true,
    }, {
      after: 'absence'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('bulletin', 'evaluations1Bim')
    await queryInterface.removeColumn('bulletin', 'evaluations2Bim')
    await queryInterface.removeColumn('bulletin', 'evaluations3Bim')
    await queryInterface.removeColumn('bulletin', 'evaluations4Bim')

    await queryInterface.removeColumn('bulletin', 'totalClasses')
    await queryInterface.removeColumn('bulletin', 'classesGiven')
    await queryInterface.removeColumn('bulletin', 'absence')
    await queryInterface.removeColumn('bulletin', 'frequency')

    await queryInterface.addColumn('bulletin', 'totalClasses', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'grade4Bim'
    })
    await queryInterface.addColumn('bulletin', 'classesGiven', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'totalClasses'
    })
    await queryInterface.addColumn('bulletin', 'absence', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'classesGiven'
    })
    await queryInterface.addColumn('bulletin', 'frequency', {
      type: Sequelize.DECIMAL,
      allowNull: false,
    }, {
      after: 'absence'
    })
  }
};
