const DataTypes = require('sequelize');

const guild = db.connection.define('guild', {
  guild_id: {
    primaryKey: true, type: DataTypes.STRING, required: true,
  }, bot_admin_role: {
    type: DataTypes.STRING, required: true,
  }, bot_config_channel: {
    type: DataTypes.STRING, required: true,
  },
}, {
  schema: db.config.dbSchema,
});

module.exports = guild;
