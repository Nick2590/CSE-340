import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/project';

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('render.com') || connectionString.includes('postgres') ? { rejectUnauthorized: false } : false
});

const query = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return { rows: result.rows };
};

const run = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result;
};

const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS organization (
      organization_id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      contact_email VARCHAR(255) NOT NULL,
      logo_filename VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project (
      project_id SERIAL PRIMARY KEY,
      organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      location VARCHAR(255) NOT NULL,
      project_date DATE NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS category (
      category_id SERIAL PRIMARY KEY,
      category_name VARCHAR(100) NOT NULL UNIQUE
    );
  `);
};

export { pool as default, query, testConnection, initializeDatabase };