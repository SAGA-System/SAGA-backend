const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schoolcalls', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    idClass: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'class',
        key: 'id'
      }
    },
    classTheme: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    gang: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    bimester: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    absents: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'schoolcalls',
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
        name: "idUser",
        using: "BTREE",
        fields: [
          { name: "idUser" },
        ]
      },
      {
        name: "idClass",
        using: "BTREE",
        fields: [
          { name: "idClass" },
        ]
      },
    ]
  });
};
