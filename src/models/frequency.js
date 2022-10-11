const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('frequency', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idStudentClasses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'studentclasses',
        key: 'id'
      }
    },
    classTheme: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    totalClasses: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    classGiven: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    absenceGiven: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'frequency',
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
        name: "idStudentClasses",
        using: "BTREE",
        fields: [
          { name: "idStudentClasses" },
        ]
      },
    ]
  });
};
