const Guild = require('../models/guild.js');

if (!db.config.dbProd) {
  Guild.sync({force: true});
}
