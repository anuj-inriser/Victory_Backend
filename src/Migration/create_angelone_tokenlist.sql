-- Create AngelOneTokenList table to store scrip master data from Angel Broking
-- This table will be populated daily from: https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json

CREATE TABLE IF NOT EXISTS AngelOneTokenList (
  token VARCHAR(50) PRIMARY KEY,
  symbol VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  expiry VARCHAR(50),
  strike DECIMAL(20, 6),
  lotsize INTEGER,
  instrumenttype VARCHAR(50),
  exch_seg VARCHAR(20),
  tick_size DECIMAL(20, 6),
  last_synced_date DATE,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on symbol for faster lookups
CREATE INDEX IF NOT EXISTS idx_angelone_symbol ON AngelOneTokenList(symbol);

-- Create index on exchange segment for filtering
CREATE INDEX IF NOT EXISTS idx_angelone_exch_seg ON AngelOneTokenList(exch_seg);

-- Create index on instrument type for filtering
CREATE INDEX IF NOT EXISTS idx_angelone_instrumenttype ON AngelOneTokenList(instrumenttype);

COMMENT ON TABLE AngelOneTokenList IS 'Stores Angel Broking scrip master data synced daily';
