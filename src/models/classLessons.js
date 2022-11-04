const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('classLessons', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idClass: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'class',
        key: 'id'
      }
    },
    monday: {
      type: DataTypes.JSON,
      allowNull: false
    },
    tuesday: {
      type: DataTypes.JSON,
      allowNull: false
    },
    wednesday: {
      type: DataTypes.JSON,
      allowNull: false
    },
    thursday: {
      type: DataTypes.JSON,
      allowNull: false
    },
    friday: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'classLessons',
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
        name: "classLessons_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "idClass" },
        ]
      },
    ]
  });
};
