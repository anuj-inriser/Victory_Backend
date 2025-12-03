const { createClient } = require('redis');
const { env } = require('../config/env.js');
const { logger } = require('../config/logger.js');

 const redisClient = createClient({
  url: env.redis.url
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

 async function initRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

module.exports = {initRedis, redisClient}
