const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing in backend/.env');
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: /localhost|127\.0\.0\.1|::1/.test(databaseUrl) ? false : { rejectUnauthorized: false },
});

async function run() {
    const sqlPath = path.resolve(__dirname, '../database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sql);
    console.log('Database schema applied successfully from backend/database.sql');
}

run()
    .catch((err) => {
        console.error('Failed to apply database schema:', err.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
