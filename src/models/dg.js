import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL || process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/cse340';
const ssl = connectionString.includes('render.com') ? { rejectUnauthorized: false } : false;

const pool = new Pool({
  connectionString,
  ssl,
});

const query = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return { rows: result.rows };
};

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

const initializeDatabase = async () => {
  const setupScriptPath = path.resolve(__dirname, '..', '..', 'setup.sql');

  if (!fs.existsSync(setupScriptPath)) {
    throw new Error(`Database setup file not found at ${setupScriptPath}`);
  }

  const scriptContent = fs.readFileSync(setupScriptPath, 'utf8');
  const cleanedSql = scriptContent.replace(/--.*$/gm, '').replace(/\r/g, '');
  const statements = cleanedSql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }
};

export { pool, query, testConnection, initializeDatabase };
export default pool;