const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bulletin', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idStudent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
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
    grade1Bim: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    grade2Bim: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    grade3Bim: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    grade4Bim: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    gradeFinal: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    totalClasses: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    classesGiven: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    absence: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    frequency: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'bulletin',
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
        name: "Bulletin_fk0",
        using: "BTREE",
        fields: [
          { name: "idStudent" },
        ]
      },
      {
        name: "Bulletin_fk1",
        using: "BTREE",
        fields: [
          { name: "idTeacher" },
        ]
      },
      {
        name: "Bulletin_fk2",
        using: "BTREE",
        fields: [
          { name: "idClass" },
        ]
      },
    ]
  });
};
