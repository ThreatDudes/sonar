const {parentPort} = require('worker_threads');

parentPort.on('message', (data) => {
  parentPort.postMessage({data: findGuildByFeedURL(data.item, data.db)});
});

const findGuildByFeedURL = (item, db) => {
  db.guild.findAll({
    attributes: ['guild_id', 'bot_feed_channel'], include: [{
      model: db.feed,
      as: 'feeds',
      where: {url: item.feedLink},
      required: true,
    }],
  }).then((botChannels) => {
    console.log(data)
    if (!Object.keys(botChannels).length === 0) {
      return botChannels;
    } else {
      return false;
    }
  });
};

