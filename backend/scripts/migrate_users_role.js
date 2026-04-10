require('dotenv').config();
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: /localhost|127\.0\.0\.1|::1/.test(databaseUrl) ? false : { rejectUnauthorized: false },
});

async function run() {
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'student'");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
    await pool.query("UPDATE users SET role = 'student' WHERE role IS NULL OR role = ''");
    console.log('users table migration applied');
}

run()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
