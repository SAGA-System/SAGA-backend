const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idInstitution: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'institution',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "cpf"
    },
    rg: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email"
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    resetPassword: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    idRole: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    avatarKey: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    CEP: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "Users_fk0",
        using: "BTREE",
        fields: [
          { name: "idInstitution" },
        ]
      },
      {
        name: "users_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "idRole" },
        ]
      },
    ]
  });
};
