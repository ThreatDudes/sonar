const DataTypes = require('sequelize');

module.exports = (db) => {
  const Guild = db.connection.define('guilds', {
    guild_id: {
      primaryKey: true, type: DataTypes.STRING, required: true,
    }, bot_admin_role: {
      type: DataTypes.STRING, required: true,
    }, bot_config_channel: {
      type: DataTypes.STRING, required: true,
    }, bot_feed_channel: {
      type: DataTypes.STRING, required: true,
    },
  }, {
    schema: db.config.dbSchema,
  });
  return Guild;
};
