const Sequelize = require('sequelize');
const config = require('../../config/db.json');
const connection = new Sequelize({
  dialect: config.dbDialect,
  username: config.dbUsername,
  password: config.dbPassword,
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  pool: config.dbPool,
});

const db = {};

db.Sequelize = Sequelize;
db.connection = connection;
db.config = config;

module.exports = db;
global.db = db;
