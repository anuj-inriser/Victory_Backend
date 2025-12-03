const { asyncHandler } = require('../utils/asyncHandler.js');
const { PriceService } = require('../services/price.service.js');

const getPrices = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 200;
  const symbol = req.query.symbol || 'SBIN';
  const rows = await PriceService.getLatest(limit, symbol);
  res.json(rows);
});

const getLatestPrice = asyncHandler(async (req, res) => {
  const symbol = req.query.symbol || 'SBIN';
  const data = await PriceService.getLatestFromRedis(symbol);
  if (!data) {
    return res.status(404).json({ error: 'No live data available yet' });
  }
  res.json(data);
});

const postPrice = asyncHandler(async (req, res) => {
  const { symbol = 'SBIN', ts, value } = req.body;
  const point = await PriceService.insertTick({ symbol, ts, value });
  res.status(201).json(point);
});

const getHistory = asyncHandler(async (req, res) => {
  const { symbol = 'SBIN', range, resolution, limit = 1000 } = req.query;
  const data = await PriceService.getHistory({ symbol, range, resolution, limit });
  res.json(data);
});

module.exports = { getHistory, postPrice, getLatestPrice, getPrices }
