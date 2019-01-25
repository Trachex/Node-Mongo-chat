const redis = require('redis');

redis.client = redis.createClient();

redis.client.on('connect', () => console.log('Connection to Redis is successful'));
redis.client.on('error', err => console.log(err));

module.exports = redis;
