const { tsClient } = require('../db/timescaleClient.js');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        console.log('Connecting to database...');
        await tsClient.connect();

        const migrationFile = '005_create_new_ohlc_tables.sql';
        // Correct path to 'Migration' (capital 'M' based on directory listing)
        const filePath = path.join(__dirname, '..', 'Migration', migrationFile);

        if (!fs.existsSync(filePath)) {
            console.error(`Migration file ${migrationFile} not found at ${filePath}!`);
            process.exit(1);
        }

        console.log(`Executing ${migrationFile}...`);
        const sql = fs.readFileSync(filePath, 'utf-8');

        // Execute query
        await tsClient.query(sql);

        console.log('Migration completed successfully!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await tsClient.end();
    }
}

runMigration();
