const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('teacherLessons', {
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
    monday: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tuesday: {
      type: DataTypes.JSON,
      allowNull: true
    },
    wednesday: {
      type: DataTypes.JSON,
      allowNull: true
    },
    thursday: {
      type: DataTypes.JSON,
      allowNull: true
    },
    friday: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'teacherLessons',
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
        name: "teacherLessons_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "idTeacher" },
        ]
      },
    ]
  });
};
