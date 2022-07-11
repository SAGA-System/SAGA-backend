const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('institution', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cnpj: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "cnpj"
    },
    courses: {
      type: DataTypes.JSON,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    bimDates: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'institution',
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
        name: "cnpj",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cnpj" },
        ]
      },
    ]
  });
};
