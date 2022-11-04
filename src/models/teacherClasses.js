const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('teacherClasses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idTeacher: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
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
    gang: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    classTheme: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'teacherClasses',
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
        name: "teacherClasses_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "idClass" },
        ]
      },
      {
        name: "teacherClasses_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "idTeacher" },
        ]
      },
    ]
  });
};
