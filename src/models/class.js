const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('class_', {
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
    period: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    course: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    schoolYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teachers: {
      type: DataTypes.JSON,
      allowNull: false
    },
    students: {
      type: DataTypes.JSON,
      allowNull: false
    },
    lessons: {
      type: DataTypes.JSON,
      allowNull: false
    },
    block: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    classNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    classTheme: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'class',
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
        name: "Class_fk0",
        using: "BTREE",
        fields: [
          { name: "idInstitution" },
        ]
      },
    ]
  });
};
