const path = require("path");
require('dotenv').config()

module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",

    migrationStorage: "json",
    migrationStoragePath: path.resolve('src' , 'database' , 'historyMigrations.json'),

    logging: false
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port:  process.env.MYSQL_PORT,
    dialect: "mysql",

    logging: false
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port:  process.env.MYSQL_PORT,
    dialect: "mysql",

    logging: false
  }
}