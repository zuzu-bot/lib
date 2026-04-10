const { Pool } = require('pg');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Create backend/.env from backend/.env.example and provide a valid PostgreSQL connection string.'
  );
}

// Use connectionString for Neon / Render / Local
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: /localhost|127\.0\.0\.1|::1/.test(databaseUrl) ? false : { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
