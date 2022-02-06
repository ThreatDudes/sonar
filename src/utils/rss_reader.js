const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter();

const reloadRSSFeeds = () => {
  db.feed.findAll(
      {
        attributes: ['url'],
        include: [
          {
            model: db.protocol,
            as: 'protocols',
            where: {name: 'rss'},
            required: true,
          },
        ],
      },
  ).then((rssFeeds) => {
    rssFeeds.forEach((feed) => {
      feeder.add({
        url: feed.url,
        refresh: 2000,
      });
    });
  });
};

const rssReader = {
  reload: reloadRSSFeeds,
  feeder: feeder,
};

module.exports = rssReader;
