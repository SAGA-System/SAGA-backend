'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.dropTable('evaluation')
    await queryInterface.createTable('evaluations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      idSchoolCall: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'schoolcalls',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      instruments: {
        type: Sequelize.STRING,
        allowNull: false
      },
      grades: {
        type: Sequelize.JSON,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('evaluations')
    await queryInterface.createTable('evaluation', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      idClass: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'class',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      idTeacher: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      minDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      maxDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      period: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    })
  }
};
