import { Pool } from 'pg';

const connectionString = process.env.DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing DB_URL or DATABASE_URL environment variable.');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

export { pool as default, testConnection };