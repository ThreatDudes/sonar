const redis = require('redis');
const cacheConfig = require('../../config/cache.json');

const client = redis.createClient(
    cacheConfig.redisPort,
    cacheConfig.redisHost,
);

client.connect();

client.on('connect', function() {
  console.log('Connected!');
});

client.set('framework', 'ReactJS', function(err, reply) {
  console.log('Works!'); // OK
});

client.get('framework', function(err, reply) {
  console.log(reply); // ReactJS
});

module.exports = client;
global.redis = client;

