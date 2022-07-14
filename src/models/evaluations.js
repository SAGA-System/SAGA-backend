const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('evaluations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idSchoolCall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schoolcalls',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    method: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    instruments: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    grades: {
      type: DataTypes.JSON,
      allowNull: false
    },
    bimester: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'evaluations',
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
        name: "idSchoolCall",
        using: "BTREE",
        fields: [
          { name: "idSchoolCall" },
        ]
      },
    ]
  });
};
