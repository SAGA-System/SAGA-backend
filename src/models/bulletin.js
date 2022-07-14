const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bulletin', {
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
    idStudentClasses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'studentclasses',
        key: 'id'
      }
    },
    totalClasses: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    classesGiven: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    absence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    frequency: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    idInstitution: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'institution',
        key: 'id'
      }
    },
    classTheme: {
      type: DataTypes.STRING(255),
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
        name: "bulletin_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "idStudentClasses" },
        ]
      },
      {
        name: "Bulletin_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "idTeacher" },
        ]
      },
      {
        name: "bulletin_ibfk_3",
        using: "BTREE",
        fields: [
          { name: "idInstitution" },
        ]
      },
    ]
  });
};
