const { tsClient } = require('../../db/timescaleClient.js');
const { newOhlcQueries } = require('../../queries/new_ohlc.queries.js');

/**
 * Interval Candles Service
 * Provides interval-specific OHLC candles with LTP and comparison metrics
 */

// Interval configuration mapping
const INTERVAL_CONFIG = {
  '1m': { bucket: '1 minute', limit: 100 },
  '5m': { bucket: '5 minutes', limit: 100 },
  '10m': { bucket: '10 minutes', limit: 100 },
  '15m': { bucket: '15 minutes', limit: 100 },
  '1h': { bucket: '1 hour', limit: 100 },
  '4h': { bucket: '4 hours', limit: 100 },
  '1d': { bucket: '1 day', limit: 100 },
  '1w': { bucket: '1 week', limit: 52 },
  '1M': { bucket: '1 month', limit: 24 }
};

/**
 * Get aggregated candles for a specific interval
 * @param {string} symbol - Stock symbol (e.g., 'SBIN')
 * @param {string} interval - Time interval ('1m', '5m', '15m', '1h', '1d', '1w')
 * @param {number} limit - Number of candles to return (default: 100)
 * @returns {Promise<Array>} Array of OHLC candles
 */
async function getIntervalCandles(symbol, interval, limit = 100) {
  const config = INTERVAL_CONFIG[interval];

  if (!config) {
    throw new Error(`Invalid interval: ${interval}. Supported: ${Object.keys(INTERVAL_CONFIG).join(', ')}`);
  }

  try {
    let result;

    // Use new tables for 1m and 5m and 10m
    if (interval === '1m') {
      const query = newOhlcQueries.get1MinCandles(symbol, limit);
      result = await tsClient.query(query);
    } else if (interval === '5m') {
      const query = newOhlcQueries.get5MinCandles(symbol, limit);
      result = await tsClient.query(query);
    } else if (interval === '10m') {
      const query = newOhlcQueries.get10MinCandles(symbol, limit);
      result = await tsClient.query(query);
    } else {
      // Fallback to old table for other intervals (or implement aggregation from 1m/5m)
      const query = `
        SELECT 
          time_bucket($1::interval, ts) AS time,
          FIRST(open, ts) AS open,
          MAX(high) AS high,
          MIN(low) AS low,
          LAST(close, ts) AS close,
          SUM(volume) AS volume
        FROM candles_ohlc
        WHERE symbol = $2
          AND ts >= NOW() - INTERVAL '1 year'
        GROUP BY time
        ORDER BY time DESC
        LIMIT $3
      `;
      result = await tsClient.query(query, [config.bucket, symbol, limit]);
    }

    // Return in ascending order (oldest to newest)
    return result.rows.reverse().map(row => ({
      time: Math.floor(new Date(row.time).getTime() / 1000), // Unix timestamp in seconds
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseFloat(row.volume || 0)
    }));
  } catch (error) {
    console.error(`Error fetching ${interval} candles for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Get the previous interval's close price
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval
 * @returns {Promise<number|null>} Previous candle's close price
 */
async function getPreviousIntervalClose(symbol, interval) {
  const candles = await getIntervalCandles(symbol, interval, 2);
  if (candles.length >= 2) {
    return candles[candles.length - 2].close;
  }
  return null;
}


/**
 * Get complete interval data with LTP and comparison metrics
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval
 * @param {number} limit - Number of candles to return
 * @returns {Promise<Object>} Complete interval data
 */
async function getIntervalData(symbol, interval, limit = 100) {
  try {
    // Fetch candles for the interval
    const candles = await getIntervalCandles(symbol, interval, limit);

    if (candles.length === 0) {
      return {
        interval,
        candles: [],
        ltp: null,
        previousClose: null,
        percentChange: null,
        priceChange: null
      };
    }

    // LTP is the close of the most recent candle
    const lastCandle = candles[candles.length - 1];
    const ltp = lastCandle.close;

    // Get previous interval's close
    const previousClose = await getPreviousIntervalClose(symbol, interval);

    // Calculate changes
    let percentChange = null;
    let priceChange = null;

    if (previousClose !== null && previousClose !== 0) {
      priceChange = ltp - previousClose;
      percentChange = (priceChange / previousClose) * 100;
    }

    return {
      interval,
      candles,
      ltp,
      previousClose,
      priceChange,
      percentChange,
      // Include OHLC from the last candle
      ohlc: {
        open: lastCandle.open,
        high: lastCandle.high,
        low: lastCandle.low,
        close: lastCandle.close
      }
    };
  } catch (error) {
    console.error(`Error getting interval data for ${symbol} (${interval}):`, error);
    throw error;
  }
}

/**
 * Get data for all intervals at once
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Data for all intervals
 */
async function getAllIntervalsData(symbol) {
  const intervals = Object.keys(INTERVAL_CONFIG);

  try {
    const results = await Promise.all(
      intervals.map(interval => getIntervalData(symbol, interval))
    );

    // Convert array to object keyed by interval
    const data = {};
    results.forEach((result, index) => {
      data[intervals[index]] = result;
    });

    return data;
  } catch (error) {
    console.error(`Error fetching all intervals for ${symbol}:`, error);
    throw error;
  }
}

module.exports = { getAllIntervalsData, getIntervalCandles, getIntervalData, getPreviousIntervalClose };
