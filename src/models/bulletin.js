const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bulletin', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idStudentClasses: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idTeacher: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    grade1Bim: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    evaluations1Bim: {
      type: DataTypes.JSON,
      allowNull: true
    },
    grade2Bim: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    evaluations2Bim: {
      type: DataTypes.JSON,
      allowNull: true
    },
    grade3Bim: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    evaluations3Bim: {
      type: DataTypes.JSON,
      allowNull: true
    },
    grade4Bim: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    evaluations4Bim: {
      type: DataTypes.JSON,
      allowNull: true
    },
    gradeFinal: {
      type: DataTypes.STRING(10),
      allowNull: true
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
    ]
  });
};
