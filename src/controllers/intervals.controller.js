const { getAllIntervalsData, getIntervalData } = require('../services/marketData/intervalCandles.service.js');
const { insertOhlc } = require('../models/ohlc.model.js');
const { asyncHandler } = require('../utils/asyncHandler.js');

const INTERVAL_TO_TABLE = {
  '1Min': '1Min_OHLC',
  '5Min': '5Min_OHLC',
  '10Min': '10Min_OHLC',
  '15Min': '15Min_OHLC',
  '30Min': '30Min_OHLC',
  '1Hour': '1Hour_OHLC',
  '4Hour': '4Hour_OHLC',
  '1Day': '1Day_OHLC',
  '1Week': '1Week_OHLC'
};

const getTableName = (interval) => {
  if (!interval) return null;
  // Case insensitive match
  const key = Object.keys(INTERVAL_TO_TABLE).find(k => k.toLowerCase() === interval.toLowerCase());
  return key ? INTERVAL_TO_TABLE[key] : null;
};

const fetchIntervalData = asyncHandler(async (req, res) => {
  const { symbol, interval, limit } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  if (!interval || interval === "undefined" || interval === "null" || interval.trim() === "") {
    return res.status(400).json({ error: 'Interval is required (1m, 5m, 10m, 15m, 1h, 4h, 1d, 1w)' });
  }

  const parsedLimit = limit ? parseInt(limit, 10) : 100;

  const data = await getIntervalData(symbol, interval, parsedLimit);

  return res.status(200).json({
    status: 'success',
    interval,
    count: data.length,
    data
  });
});

const fetchAllIntervals = asyncHandler(async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  const data = await getAllIntervalsData(symbol);

  return res.status(200).json({
    status: 'success',
    data
  });
});

const saveIntervalData = asyncHandler(async (req, res) => {
  const { interval } = req.params;
  const { symbol, exchange, time, open, high, low, close, volume } = req.body;

  const tableName = getTableName(interval);
  // Also try to map from "1m" style to "1Min" if needed, but the user requested explicit timeframes
  // User request: 1Min 5Min 10Min 15Min 30Min 1Hour 4Hour 1Day 1Week

  if (!tableName) {
    return res.status(400).json({
      status: false,
      message: `Invalid interval: ${interval}. Supported: ${Object.keys(INTERVAL_TO_TABLE).join(', ')}`
    });
  }

  if (!symbol || !open || !high || !low || !close) {
    return res.status(400).json({ status: false, message: 'Missing required fields' });
  }

  const result = await insertOhlc({
    tableName,
    symbol,
    exchange,
    ts: time,
    open,
    high,
    low,
    close,
    volume
  });

  return res.status(201).json({
    status: true,
    message: `${interval} Candle saved successfully`,
    data: result
  });
});

module.exports = { fetchIntervalData, fetchAllIntervals, saveIntervalData };
