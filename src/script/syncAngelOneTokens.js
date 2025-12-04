const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { logger } = require('../config/logger.js');
const { timescaleClient } = require('../db/timescaleClient.js');


const ANGEL_SCRIP_MASTER_URL = 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json';
const LOCAL_SCRIP_FILE = path.join(__dirname, '../config/OpenAPIScripMaster.json');
// const LOCAL_SCRIP_FILE = false;

/**
 * Sync Angel One Token List from local file or API to database 
 * - First run: Uses local file if available, otherwise API
 * - Subsequent runs: Only runs once per day, fetches from API
 * - Only updates if data has changed
 */
async function syncAngelOneTokenList() {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Check if we already synced today
        const checkQuery = `
      SELECT last_synced_date FROM AngelOneTokenList 
      WHERE last_synced_date = $1 
      LIMIT 1
    `;
        const checkResult = await timescaleClient.query(checkQuery, [today]);

        if (checkResult.rows.length > 0) {
            logger.info(`[AngelTokenSync] Already synced today (${today}). Skipping.`);
            return { success: true, message: 'Already synced today', skipped: true };
        }

        logger.info('[AngelTokenSync] Starting scrip master sync...');

        let scripData;

        // Check if database is empty (first time run)
        const countQuery = 'SELECT COUNT(*) as count FROM AngelOneTokenList';
        const countResult = await timescaleClient.query(countQuery);
        const isFirstRun = parseInt(countResult.rows[0].count) === 0;

        // If first run and local file exists, use local file
        if (isFirstRun && fs.existsSync(LOCAL_SCRIP_FILE)) {
            logger.info(`[AngelTokenSync] 🎯 First run detected. Loading from local file: ${LOCAL_SCRIP_FILE}`);
            const fileContent = fs.readFileSync(LOCAL_SCRIP_FILE, 'utf8');
            scripData = JSON.parse(fileContent);
            logger.info(`[AngelTokenSync] ✅ Loaded ${scripData.length} instruments from local file`);
        } else {
            // Fetch from API
            logger.info(`[AngelTokenSync] Fetching data from API: ${ANGEL_SCRIP_MASTER_URL}`);
            const response = await axios.get(ANGEL_SCRIP_MASTER_URL, {
                timeout: 300000, // 5 minutes timeout
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from API');
            }

            scripData = response.data;
            logger.info(`[AngelTokenSync] Fetched ${scripData.length} instruments from API`);
        }

        // Get existing data for comparison
        const existingDataQuery = 'SELECT token FROM AngelOneTokenList';
        const existingData = await timescaleClient.query(existingDataQuery);
        const existingTokens = new Set(existingData.rows.map(row => row.token));

        // Prepare bulk insert/update
        const newRecords = [];
        const updatedRecords = [];

        for (const item of scripData) {
            const record = {
                token: item.token,
                symbol: item.symbol || '',
                name: item.name || '',
                expiry: item.expiry || null,
                strike: item.strike ? parseFloat(item.strike) : null,
                lotsize: item.lotsize ? parseInt(item.lotsize) : null,
                instrumenttype: item.instrumenttype || null,
                exch_seg: item.exch_seg || null,
                tick_size: item.tick_size ? parseFloat(item.tick_size) : null
            };

            if (existingTokens.has(item.token)) {
                updatedRecords.push(record);
            } else {
                newRecords.push(record);
            }
        }

        logger.info(`[AngelTokenSync] New: ${newRecords.length}, Updates: ${updatedRecords.length}`);

        // Only proceed if there are changes
        if (newRecords.length === 0 && updatedRecords.length === 0) {
            logger.info('[AngelTokenSync] No changes detected. Database is up to date.');
            return { success: true, message: 'No changes detected', total: scripData.length };
        }

        // Bulk upsert: insert new rows or update existing ones
        const upsertQuery = `
          INSERT INTO AngelOneTokenList
          (token, symbol, name, expiry, strike, lotsize, instrumenttype, exch_seg, tick_size, last_synced_date, last_updated)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
          ON CONFLICT (token) DO UPDATE SET
            symbol = EXCLUDED.symbol,
            name = EXCLUDED.name,
            expiry = EXCLUDED.expiry,
            strike = EXCLUDED.strike,
            lotsize = EXCLUDED.lotsize,
            instrumenttype = EXCLUDED.instrumenttype,
            exch_seg = EXCLUDED.exch_seg,
            tick_size = EXCLUDED.tick_size,
            last_synced_date = EXCLUDED.last_synced_date,
            last_updated = NOW();
        `;

        for (const record of scripData) {
            await timescaleClient.query(upsertQuery, [
                record.token,
                record.symbol || '',
                record.name || '',
                record.expiry || null,
                record.strike ? parseFloat(record.strike) : null,
                record.lotsize ? parseInt(record.lotsize) : null,
                record.instrumenttype || null,
                record.exch_seg || null,
                record.tick_size ? parseFloat(record.tick_size) : null,
                today
            ]);
        }

        logger.info(`[AngelTokenSync] Upserted ${scripData.length} records`);


    } catch (error) {
        logger.error(`[AngelTokenSync] ❌ Error: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Helper function to query Angel One Token List
 */
async function getAngelOneTokens(filters = {}) {
    try {
        let query = 'SELECT * FROM AngelOneTokenList WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (filters.exch_seg) {
            query += ` AND exch_seg = $${paramIndex}`;
            params.push(filters.exch_seg);
            paramIndex++;
        }

        if (filters.instrumenttype) {
            query += ` AND instrumenttype = $${paramIndex}`;
            params.push(filters.instrumenttype);
            paramIndex++;
        }

        if (filters.symbol) {
            query += ` AND symbol ILIKE $${paramIndex}`;
            params.push(`%${filters.symbol}%`);
            paramIndex++;
        }

        query += ' ORDER BY symbol LIMIT 1000';

        const result = await timescaleClient.query(query, params);
        return result.rows;
    } catch (error) {
        logger.error(`[AngelTokenSync] Query error: ${error.message}`);
        throw error;
    }
}


module.exports = {
    syncAngelOneTokenList,
    getAngelOneTokens
};
