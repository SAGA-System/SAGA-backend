const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('students', {
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
    ra: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "ra"
    },
    schoolYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    situation: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    gang: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    frequency: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'students',
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
        name: "ra",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ra" },
        ]
      },
      {
        name: "Students_fk0",
        using: "BTREE",
        fields: [
          { name: "idUser" },
        ]
      },
      {
        name: "Students_fk1",
        using: "BTREE",
        fields: [
          { name: "idClass" },
        ]
      },
    ]
  });
};
