/**
 * New OHLC Queries
 * SQL queries for 1Min_OHLC and 5Min_OHLC tables
 */

const newOhlcQueries = {
  /**
   * Insert 1-minute candle
   */
  insert1MinCandle: (candle) => ({
    text: `
      INSERT INTO "1Min_OHLC" ("Symbol", "ExchangeID", "Time", "Open", "High", "Low", "Close", "Volume")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT ("Symbol", "Time") DO UPDATE SET
        "Open" = EXCLUDED."Open",
        "High" = EXCLUDED."High",
        "Low" = EXCLUDED."Low",
        "Close" = EXCLUDED."Close",
        "Volume" = EXCLUDED."Volume"
      RETURNING *
    `,
    values: [
      candle.Symbol,
      candle.ExchangeID,
      candle.Time,
      candle.Open,
      candle.High,
      candle.Low,
      candle.Close,
      candle.Volume || 0
    ]
  }),

  /**
   * Insert 5-minute candle
   */
  insert5MinCandle: (candle) => ({
    text: `
      INSERT INTO "5Min_OHLC" ("Symbol", "ExchangeID", "Time", "Open", "High", "Low", "Close", "Volume")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT ("Symbol", "Time") DO UPDATE SET
        "Open" = EXCLUDED."Open",
        "High" = EXCLUDED."High",
        "Low" = EXCLUDED."Low",
        "Close" = EXCLUDED."Close",
        "Volume" = EXCLUDED."Volume"
      RETURNING *
    `,
    values: [
      candle.Symbol,
      candle.ExchangeID,
      candle.Time,
      candle.Open,
      candle.High,
      candle.Low,
      candle.Close,
      candle.Volume || 0
    ]
  }),

  /**
   * Get 1-minute candles
   */
  get1MinCandles: (symbol, limit = 100) => ({
    text: `
      SELECT 
        "Time" as time,
        "Open" as open,
        "High" as high,
        "Low" as low,
        "Close" as close,
        "Volume" as volume
      FROM "1Min_OHLC"
      WHERE "Symbol" = $1
      ORDER BY "Time" DESC
      LIMIT $2
    `,
    values: [symbol, limit]
  }),

  /**
   * Get 5-minute candles
   */
  get5MinCandles: (symbol, limit = 100) => ({
    text: `
      SELECT 
        "Time" as time,
        "Open" as open,
        "High" as high,
        "Low" as low,
        "Close" as close,
        "Volume" as volume
      FROM "5Min_OHLC"
      WHERE "Symbol" = $1
      ORDER BY "Time" DESC
      LIMIT $2
    `,
    values: [symbol, limit]
  }),

  /**
   * Aggregate 1-min candles to create a 5-min candle
   * Used to calculate 5-min candle from DB if needed
   */
  aggregateTo5Min: (symbol, startTime, endTime) => ({
    text: `
      SELECT 
        $1::text as "Symbol",
        MAX("ExchangeID") as "ExchangeID",
        $2::timestamptz as "Time",
        FIRST("Open", "Time") as "Open",
        MAX("High") as "High",
        MIN("Low") as "Low",
        LAST("Close", "Time") as "Close",
        SUM("Volume") as "Volume"
      FROM "1Min_OHLC"
      WHERE "Symbol" = $1
        AND "Time" >= $2
        AND "Time" < $3
    `,
    values: [symbol, startTime, endTime]
  })
};

module.exports = { newOhlcQueries };

