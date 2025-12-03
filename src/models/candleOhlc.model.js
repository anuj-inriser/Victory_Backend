const { tsClient } = require('../db/timescaleClient.js');

async function insertCandle({ symbol, ts, open, high, low, close, volume }) {
  const sqlTs = ts ? new Date(ts) : new Date();
  const { rows } = await tsClient.query(
    `INSERT INTO candles_ohlc (symbol, ts, open, high, low, close, volume)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING symbol, ts, open, high, low, close, volume`,
    [symbol, sqlTs, open, high, low, close, volume ?? null],
  );
  return rows[0];
}

/**
 * Check if historical data exists for a symbol
 */
async function hasHistoricalData(symbol) {
  const { rows } = await tsClient.query(
    `SELECT COUNT(*) as count FROM candles_ohlc WHERE symbol = $1`,
    [symbol]
  );
  return parseInt(rows[0].count) > 0;
}

async function getDailyCandles({ symbol, from, to, limit }) {
  const params = [symbol];
  let where = 'symbol = $1';
  let idx = 2;

  if (from) {
    params.push(from);
    where += ` AND ts >= $${idx}`;
    idx += 1;
  }

  if (to) {
    params.push(to);
    where += ` AND ts <= $${idx}`;
    idx += 1;
  }

  const limitValue = limit || 400;
  params.push(limitValue);
  const limitIdx = idx;

  // Use DISTINCT ON to avoid duplicate timestamps
  // Order by ts DESC first to get latest data, then reverse for chronological order
  const { rows } = await tsClient.query(
    `SELECT DISTINCT ON (symbol, ts) symbol, ts, open, high, low, close, COALESCE(volume, 0) AS volume
     FROM candles_ohlc
     WHERE ${where}
     ORDER BY symbol, ts DESC
     LIMIT $${limitIdx}`,
    params,
  );

  // Reverse to get ascending chronological order (required by lightweight-charts)
  return rows.reverse().map((r) => ({
    t: Math.floor(new Date(r.ts).getTime() / 1000),
    o: Number(r.open),
    h: Number(r.high),
    l: Number(r.low),
    c: Number(r.close),
    v: Number(r.volume) || 0,
  }));
}

/**
 * Get daily candles aggregated per day, filtering only market hours (09:30-15:30 IST)
 * Returns one candle per day
 */
async function getDailyCandlesWithMarketHours({ symbol, from, limit }) {
  const params = [symbol];
  let where = 'symbol = $1';
  let idx = 2;

  if (from) {
    params.push(from);
    where += ` AND ts >= $${idx}`;
    idx += 1;
  }

  // Filter only market hours (09:30 to 15:30)
  where += ` AND EXTRACT(HOUR FROM ts) >= 9 AND EXTRACT(HOUR FROM ts) < 16`;
  where += ` AND NOT (EXTRACT(HOUR FROM ts) = 9 AND EXTRACT(MINUTE FROM ts) < 30)`;
  where += ` AND NOT (EXTRACT(HOUR FROM ts) = 15 AND EXTRACT(MINUTE FROM ts) > 30)`;

  const limitValue = limit || 400;
  params.push(limitValue);
  const limitIdx = idx;

  // Aggregate by day using time_bucket
  const { rows } = await tsClient.query(
    `SELECT 
       time_bucket('1 day', ts) AS day,
       FIRST(open, ts) AS open,
       MAX(high) AS high,
       MIN(low) AS low,
       LAST(close, ts) AS close,
       SUM(COALESCE(volume, 0)) AS volume
     FROM candles_ohlc
     WHERE ${where}
     GROUP BY day
     ORDER BY day DESC
     LIMIT $${limitIdx}`,
    params,
  );

  // Reverse to get ascending chronological order
  return rows.reverse().map((r) => ({
    t: Math.floor(new Date(r.day).getTime() / 1000),
    o: Number(r.open),
    h: Number(r.high),
    l: Number(r.low),
    c: Number(r.close),
    v: Number(r.volume) || 0,
  }));
}

/**
 * Get weekly candles aggregated Monday-Friday
 */
async function getWeeklyCandlesAggregated({ symbol, from, limit }) {
  const params = [symbol];
  let where = 'symbol = $1';
  let idx = 2;

  if (from) {
    params.push(from);
    where += ` AND ts >= $${idx}`;
    idx += 1;
  }

  // Filter only weekdays (Monday = 1, Friday = 5)
  where += ` AND EXTRACT(DOW FROM ts) BETWEEN 1 AND 5`;

  const limitValue = limit || 400;
  params.push(limitValue);
  const limitIdx = idx;

  // Aggregate by week using time_bucket
  const { rows } = await tsClient.query(
    `SELECT 
       time_bucket('1 week', ts) AS week,
       FIRST(open, ts) AS open,
       MAX(high) AS high,
       MIN(low) AS low,
       LAST(close, ts) AS close,
       SUM(COALESCE(volume, 0)) AS volume
     FROM candles_ohlc
     WHERE ${where}
     GROUP BY week
     ORDER BY week DESC
     LIMIT $${limitIdx}`,
    params,
  );

  // Reverse to get ascending chronological order
  return rows.reverse().map((r) => ({
    t: Math.floor(new Date(r.week).getTime() / 1000),
    o: Number(r.open),
    h: Number(r.high),
    l: Number(r.low),
    c: Number(r.close),
    v: Number(r.volume) || 0,
  }));
}

/**
 * Get monthly candles aggregated by full calendar month
 */
async function getMonthlyCandlesAggregated({ symbol, from, limit }) {
  const params = [symbol];
  let where = 'symbol = $1';
  let idx = 2;

  if (from) {
    params.push(from);
    where += ` AND ts >= $${idx}`;
    idx += 1;
  }

  const limitValue = limit || 400;
  params.push(limitValue);
  const limitIdx = idx;

  // Aggregate by month using time_bucket
  const { rows } = await tsClient.query(
    `SELECT 
       time_bucket('1 month', ts) AS month,
       FIRST(open, ts) AS open,
       MAX(high) AS high,
       MIN(low) AS low,
       LAST(close, ts) AS close,
       SUM(COALESCE(volume, 0)) AS volume
     FROM candles_ohlc
     WHERE ${where}
     GROUP BY month
     ORDER BY month DESC
     LIMIT $${limitIdx}`,
    params,
  );

  // Reverse to get ascending chronological order
  return rows.reverse().map((r) => ({
    t: Math.floor(new Date(r.month).getTime() / 1000),
    o: Number(r.open),
    h: Number(r.high),
    l: Number(r.low),
    c: Number(r.close),
    v: Number(r.volume) || 0,
  }));
}

/**
 * Get intraday candles aggregated by a custom interval (e.g., '5 minutes', '1 hour')
 * Uses minute-level data (available for last 30 days)
 */
async function getIntradayAggregatedCandles({ symbol, from, interval, limit }) {
  const params = [symbol];
  let where = 'symbol = $1';
  let idx = 2;

  if (from) {
    params.push(from);
    where += ` AND ts >= $${idx}`;
    idx += 1;
  }

  // Filter only market hours (09:30 to 15:30) to avoid empty gaps
  where += ` AND EXTRACT(HOUR FROM ts) >= 9 AND EXTRACT(HOUR FROM ts) < 16`;
  where += ` AND NOT (EXTRACT(HOUR FROM ts) = 9 AND EXTRACT(MINUTE FROM ts) < 30)`;
  where += ` AND NOT (EXTRACT(HOUR FROM ts) = 15 AND EXTRACT(MINUTE FROM ts) > 30)`;

  const limitValue = limit || 1000; // Higher default limit for intraday
  params.push(limitValue);
  const limitIdx = idx;

  // Aggregate using time_bucket with the provided interval
  // Note: interval must be a valid PostgreSQL interval string (e.g., '5 minutes')
  const { rows } = await tsClient.query(
    `SELECT 
       time_bucket('${interval}', ts) AS bucket,
       FIRST(open, ts) AS open,
       MAX(high) AS high,
       MIN(low) AS low,
       LAST(close, ts) AS close,
       SUM(COALESCE(volume, 0)) AS volume
     FROM candles_ohlc
     WHERE ${where}
     GROUP BY bucket
     ORDER BY bucket DESC
     LIMIT $${limitIdx}`,
    params,
  );

  return rows.reverse().map((r) => ({
    t: Math.floor(new Date(r.bucket).getTime() / 1000),
    o: Number(r.open),
    h: Number(r.high),
    l: Number(r.low),
    c: Number(r.close),
    v: Number(r.volume) || 0,
  }));
}


module.exports = { getDailyCandles, getDailyCandlesWithMarketHours, getWeeklyCandlesAggregated, getIntradayAggregatedCandles, getMonthlyCandlesAggregated, hasHistoricalData, insertCandle }