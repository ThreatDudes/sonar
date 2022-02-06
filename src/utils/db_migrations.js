const feedConfig = require('../../config/feeds.json');
const categoryConfig = require('../../config/categories.json');
const protocolConfig = require('../../config/protocols.json');
const Guild = db.guild;
const Feed = db.feed;
const Category = db.category;
const Protocol = db.protocol;

if (!db.config.dbProd) {
  // Synchronises the tables
  const createTables = (async () => {
    Guild.sync();
    Feed.sync();
    Category.sync();
    Protocol.sync();
  });

  createTables();

  // Load categories
  categoryConfig.forEach(async (category) => {
    await Category.create({
      name: category.name, description: category.description,
    });
  });

  // Load protocols
  protocolConfig.forEach(async (protocol) => {
    await Protocol.create({
      name: protocol.name, description: protocol.description,
    });
  });

  db.protocol.findOne({where: {name: 'rss'}}).then((protocol) => {
  // Load feeds
    feedConfig.forEach(async (feed) => {
      await Feed.create({
        feed_name: feed.name,
        url: feed.url,
        rating: feed.rating,
        active: feed.active,
        description: feed.description,
      }).then((feed) => {
        feed.setProtocols([protocol.protocol_id]);
      });
    });
  });
}
