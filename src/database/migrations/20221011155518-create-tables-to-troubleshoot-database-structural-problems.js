'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('files')

    await queryInterface.createTable('frequency', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      idStudentClasses: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'studentclasses',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      classTheme: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalClasses: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      classGiven: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      absenceGiven: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    })

    await queryInterface.createTable('teacherClasses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      gang: {
        type: Sequelize.STRING,
        allowNull: true
      },
      classTheme: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    })

    await queryInterface.createTable('teacherLessons', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      monday: {
        type: Sequelize.JSON,
        allowNull: true
      },
      tuesday: {
        type: Sequelize.JSON,
        allowNull: true
      },
      wednesday: {
        type: Sequelize.JSON,
        allowNull: true
      },
      thursday: {
        type: Sequelize.JSON,
        allowNull: true
      },
      friday: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    })

    await queryInterface.createTable('classLessons', {
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
      monday: {
        type: Sequelize.JSON,
        allowNull: false
      },
      tuesday: {
        type: Sequelize.JSON,
        allowNull: false
      },
      wednesday: {
        type: Sequelize.JSON,
        allowNull: false
      },
      thursday: {
        type: Sequelize.JSON,
        allowNull: false
      },
      friday: {
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

  async down(queryInterface, Sequelize) {
    await queryInterface.createTa('files', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      idUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      file: {
        type: Sequelize.BLOB,
        allowNull: false
      }
    })

    await queryInterface.dropTable('frequency')
    await queryInterface.dropTable('teacherClasses')
    await queryInterface.dropTable('teacherLessons')
    await queryInterface.dropTable('classLessons')
  }
};
