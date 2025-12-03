const { insertTick, insertRandomTick, getLatestTicks } = require('../models/priceTick.model.js');
const { getHistory } = require('./marketData/historyAggregation.service.js');
const { redisClient } = require('../db/redisClient.js');

async function getLatestFromRedis(symbol) {
  try {
    const data = await redisClient.get(`PRICE:LATEST:${symbol}`);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis Get Error:', err);
    return null;
  }
}

 const PriceService = {
  getLatest: getLatestTicks,
  getLatestFromRedis,
  insertTick,
  insertRandomTick,
  getHistory,
};

module.exports = {PriceService}
