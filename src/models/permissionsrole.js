const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permissionsrole', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idPermission: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id'
      }
    },
    idRole: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'permissionsrole',
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
        name: "idPermission",
        using: "BTREE",
        fields: [
          { name: "idPermission" },
        ]
      },
      {
        name: "idRole",
        using: "BTREE",
        fields: [
          { name: "idRole" },
        ]
      },
    ]
  });
};
