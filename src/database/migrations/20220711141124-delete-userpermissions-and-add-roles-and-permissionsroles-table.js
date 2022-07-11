'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.dropTable('userpermissions')

    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
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

    await queryInterface.createTable('permissionsrole', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      idPermission: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },      
      idRole: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    })

    await queryInterface.removeColumn('users', 'flowType')
    await queryInterface.removeColumn('users', 'allPermissions')

    await queryInterface.addColumn('users', 'idRole', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, {
      after: 'idInstitution'
    })
    await queryInterface.addConstraint('users', {
      fields: ['idRole'],
      type: 'foreign key',
      name: 'users_ibfk_2',
      references: { //Required field
        table: 'roles',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('roles')
    await queryInterface.dropTable('permissionsrole')

    await queryInterface.createTable('userpermissons', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      idPermission: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    })

    await queryInterface.removeConstraint('users', 'users_ibfk_2')
    await queryInterface.removeColumn('users', 'idRole')

    await queryInterface.addColumn('users', 'flowType', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
    await queryInterface.addColumn('users', 'allPermissions', {
      type: Sequelize.JSON,
      allowNull: false,
    })
  }
};
