const { tsClient } = require('../db/timescaleClient.js');

/**
 * Insert OHLC data into a specific table
 * @param {string} tableName - Name of the table (e.g., "1Min_OHLC", "10Min_OHLC")
 * @param {Object} data - Candle data
 */
async function insertOhlc({ tableName, symbol, exchange, ts, open, high, low, close, volume }) {
    // Validate table name to prevent SQL injection (allow-list approach recommended in production)
    const validTables = ['1Min_OHLC', '5Min_OHLC', '10Min_OHLC', '15Min_OHLC', '30Min_OHLC', '1Hour_OHLC', '4Hour_OHLC', '1Day_OHLC', '1Week_OHLC'];
    if (!validTables.includes(tableName)) {
        throw new Error(`Invalid table name: ${tableName}`);
    }

    const sqlTs = ts ? new Date(ts) : new Date();
    
    // Explicitly quoting table name to handle case sensitivity and special chars if any (though these are standard names now)
    // Using generic text interpolation for table name is risky but validated above.
    const query = `
        INSERT INTO "${tableName}" ("Symbol", "ExchangeID", "Time", "Open", "High", "Low", "Close", "Volume")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT ("Symbol", "Time") 
        DO UPDATE SET 
            "High" = GREATEST("${tableName}"."High", EXCLUDED."High"),
            "Low" = LEAST("${tableName}"."Low", EXCLUDED."Low"),
            "Close" = EXCLUDED."Close",
            "Volume" = "${tableName}"."Volume" + EXCLUDED."Volume"
        RETURNING *
    `;

    const { rows } = await tsClient.query(query, [
        symbol, 
        exchange || 'NSE', // Default exchange if not provided
        sqlTs, 
        open, 
        high, 
        low, 
        close, 
        volume ?? 0
    ]);

    // TRIGGER AGGREGATION IF 1-MIN CANDLE
    if (tableName === '1Min_OHLC') {
        // Run aggregation asynchronously to not block the response
        aggregateAndSave(symbol, exchange || 'NSE', sqlTs).catch(err => console.error('Aggregation Error:', err));
    }

    return rows[0];
}

const INTERVAL_CONFIG = {
    '5Min_OHLC': '5 minutes',
    '10Min_OHLC': '10 minutes',
    '15Min_OHLC': '15 minutes',
    '30Min_OHLC': '30 minutes',
    '1Hour_OHLC': '1 hour',
    '4Hour_OHLC': '4 hours',
    '1Day_OHLC': '1 day',
    '1Week_OHLC': '1 week'
};

/**
 * Aggregates 1-minute data into higher timeframes for a specific timestamp
 */
async function aggregateAndSave(symbol, exchange, timestamp) {
    const ts = new Date(timestamp);
    
    // We iterate over each target table and run an Upsert based on the 1-min data
    // This query calculates what the aggregate SHOULD be for the bucket containing 'timestamp'
    // and upserts it into the target table.
    
    for (const [targetTable, bucketSize] of Object.entries(INTERVAL_CONFIG)) {
        const query = `
            INSERT INTO "${targetTable}" ("Symbol", "ExchangeID", "Time", "Open", "High", "Low", "Close", "Volume")
            SELECT 
                $1 AS "Symbol",
                $2 AS "ExchangeID",
                time_bucket($3::interval, "Time") AS bucket,
                FIRST("Open", "Time") as "Open",
                MAX("High") as "High",
                MIN("Low") as "Low",
                LAST("Close", "Time") as "Close",
                SUM("Volume") as "Volume"
            FROM "1Min_OHLC"
            WHERE "Symbol" = $1 
              AND "Time" >= time_bucket($3::interval, $4::timestamptz)
              AND "Time" < time_bucket($3::interval, $4::timestamptz) + $3::interval
            GROUP BY bucket
            ON CONFLICT ("Symbol", "Time") 
            DO UPDATE SET 
                "Open" = EXCLUDED."Open",
                "High" = EXCLUDED."High",
                "Low" = EXCLUDED."Low",
                "Close" = EXCLUDED."Close",
                "Volume" = EXCLUDED."Volume";
        `;

        await tsClient.query(query, [symbol, exchange, bucketSize, ts]);
    }
}

/**
 * Get OHLC data from a specific table
 */
async function getOhlc({ tableName, symbol, from, to, limit }) {
    const validTables = ['1Min_OHLC', '5Min_OHLC', '10Min_OHLC', '15Min_OHLC', '30Min_OHLC', '1Hour_OHLC', '4Hour_OHLC', '1Day_OHLC', '1Week_OHLC'];
    if (!validTables.includes(tableName)) {
        throw new Error(`Invalid table name: ${tableName}`);
    }

    const params = [symbol];
    let where = '"Symbol" = $1';
    let idx = 2;

    if (from) {
        params.push(from);
        where += ` AND "Time" >= $${idx}`;
        idx += 1;
    }

    if (to) {
        params.push(to);
        where += ` AND "Time" <= $${idx}`;
        idx += 1;
    }

    const limitValue = limit || 1000;
    params.push(limitValue);
    
    const query = `
        SELECT * FROM "${tableName}"
        WHERE ${where}
        ORDER BY "Time" DESC
        LIMIT $${idx}
    `;

    const { rows } = await tsClient.query(query, params);
    
    // Reverse to return in chronological order
    return rows.reverse().map(r => ({
        symbol: r.Symbol,
        exchange: r.ExchangeID,
        time: r.Time,
        open: r.Open,
        high: r.High,
        low: r.Low,
        close: r.Close,
        volume: r.Volume
    }));
}

module.exports = { insertOhlc, getOhlc };
