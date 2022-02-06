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
db.guild = require('../models/guild.js')(db);
db.feed = require('../models/feed.js')(db);
db.category = require('../models/category')(db);
db.protocol = require('../models/protocol')(db);

db.feed.belongsToMany(db.guild, {
  through: 'guild_feeds', foreignKey: 'feed_id', otherKey: 'guild_id',
});

db.guild.belongsToMany(db.feed, {
  through: 'guild_feeds', foreignKey: 'guild_id', otherKey: 'feed_id',
});

db.category.belongsToMany(db.feed, {
  through: 'feed_categories', foreignKey: 'category_id', otherKey: 'feed_id',
});

db.feed.belongsToMany(db.category, {
  through: 'feed_categories', foreignKey: 'feed_id', otherKey: 'category_id',
});

db.category.belongsToMany(db.feed, {
  through: 'feed_protocols', foreignKey: 'protocol_id', otherKey: 'feed_id',
});

db.feed.belongsToMany(db.protocol, {
  through: 'feed_protocols', foreignKey: 'feed_id', otherKey: 'protocol_id',
});

module.exports = db;
global.db = db;
