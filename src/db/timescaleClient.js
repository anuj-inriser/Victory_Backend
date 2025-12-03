const pkg = require('pg');
const { env } = require('../config/env.js');
const { logger } = require('../config/logger.js');

const { Client } = pkg;

const tsClient = new Client(env.pg);

async function initTimescale() {
  await tsClient.connect();
  await tsClient.query('CREATE EXTENSION IF NOT EXISTS timescaledb');

  await tsClient.query(`
    CREATE TABLE IF NOT EXISTS price_ticks (
      symbol TEXT NOT NULL,
      ts TIMESTAMPTZ NOT NULL,
      value DOUBLE PRECISION NOT NULL
    );
  `);

  await tsClient.query(`
    SELECT create_hypertable('price_ticks', 'ts', if_not_exists => TRUE);
  `);

  await tsClient.query(`
    CREATE TABLE IF NOT EXISTS candles_ohlc (
      symbol TEXT NOT NULL,
      ts TIMESTAMPTZ NOT NULL,
      open DOUBLE PRECISION NOT NULL,
      high DOUBLE PRECISION NOT NULL,
      low DOUBLE PRECISION NOT NULL,
      close DOUBLE PRECISION NOT NULL,
      volume DOUBLE PRECISION
    );
  `);

  await tsClient.query(`
    SELECT create_hypertable('candles_ohlc', 'ts', if_not_exists => TRUE);
  `);

  await tsClient.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_candles_symbol_ts ON candles_ohlc (symbol, ts);
  `);

  const { rows } = await tsClient.query('SELECT NOW() AS now');
  logger.info('DB connected (v2). Server time:', rows[0].now);
}

module.exports = { tsClient, initTimescale, timescaleClient: tsClient };
