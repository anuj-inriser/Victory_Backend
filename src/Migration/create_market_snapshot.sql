-- Create market_snapshot table
CREATE TABLE IF NOT EXISTS market_snapshot (
    symbol TEXT PRIMARY KEY,
    latest_price DECIMAL NOT NULL,
    latest_ts TIMESTAMPTZ NOT NULL,
    prev_close DECIMAL,
    prev_close_ts TIMESTAMPTZ,
    day_volume BIGINT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on updated_at for potential cleanup/debugging
CREATE INDEX IF NOT EXISTS idx_market_snapshot_updated_at ON market_snapshot(updated_at);
