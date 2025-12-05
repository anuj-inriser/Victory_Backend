
CREATE TABLE IF NOT EXISTS "1Min_OHLC" (
  "Symbol" TEXT NOT NULL,
  "ExchangeID" TEXT NOT NULL,
  "Time" TIMESTAMPTZ NOT NULL,
  "Open" DOUBLE PRECISION NOT NULL,
  "High" DOUBLE PRECISION NOT NULL,
  "Low" DOUBLE PRECISION NOT NULL,
  "Close" DOUBLE PRECISION NOT NULL,
  "Volume" DOUBLE PRECISION DEFAULT 0
);


SELECT create_hypertable('"1Min_OHLC"', 'Time', if_not_exists => TRUE);


CREATE UNIQUE INDEX IF NOT EXISTS "idx_1min_symbol_time" ON "1Min_OHLC" ("Symbol", "Time");


CREATE TABLE IF NOT EXISTS "5Min_OHLC" (
  "Symbol" TEXT NOT NULL,
  "ExchangeID" TEXT NOT NULL,
  "Time" TIMESTAMPTZ NOT NULL,
  "Open" DOUBLE PRECISION NOT NULL,
  "High" DOUBLE PRECISION NOT NULL,
  "Low" DOUBLE PRECISION NOT NULL,
  "Close" DOUBLE PRECISION NOT NULL,
  "Volume" DOUBLE PRECISION DEFAULT 0
);

-- Convert to hypertable
SELECT create_hypertable('"5Min_OHLC"', 'Time', if_not_exists => TRUE);

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS "idx_5min_symbol_time" ON "5Min_OHLC" ("Symbol", "Time");
