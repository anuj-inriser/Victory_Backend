const { tsClient } = require('../db/timescaleClient.js');

async function insertTick({ symbol, ts, value }) {
  const sqlTs = ts ? new Date(ts) : new Date();
  const { rows } = await tsClient.query(
    'INSERT INTO price_ticks (symbol, ts, value) VALUES ($1, $2, $3) RETURNING symbol, ts, value',
    [symbol, sqlTs, value],
  );
  return rows[0];
}

async function insertRandomTick(symbol = 'SBIN') {
  const value = 100 + Math.random() * 10;
  return insertTick({ symbol, value });
}

async function getLatestTicks(limit = 200, symbol = 'SBIN') {
  const { rows } = await tsClient.query(
    'SELECT symbol, ts, value FROM price_ticks WHERE symbol = $2 ORDER BY ts DESC LIMIT $1',
    [limit, symbol],
  );
  return rows.reverse();
}

async function hasTodayData() {
  const { rows } = await tsClient.query(
    'SELECT 1 FROM price_ticks WHERE ts::date = CURRENT_DATE LIMIT 1',
  );
  return rows.length > 0;
}

/**
 * Aggregate ticks into candles (e.g. 1 second)
 */
async function getTickAggregatedCandles({ symbol, from, interval = '1 second', limit = 1000 }) {
  const params = [symbol];
  let where = 'symbol = $1';
  let idx = 2;

  if (from) {
    params.push(from);
    where += ` AND ts >= $${idx}`;
    idx += 1;
  }

  params.push(limit);
  const limitIdx = idx;

  const { rows } = await tsClient.query(
    `SELECT 
       time_bucket('${interval}', ts) AS bucket,
       FIRST(value, ts) AS open,
       MAX(value) AS high,
       MIN(value) AS low,
       LAST(value, ts) AS close,
       COUNT(*) AS volume
     FROM price_ticks
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

module.exports = { getLatestTicks, getTickAggregatedCandles, hasTodayData, insertRandomTick, insertTick }
