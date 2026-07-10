import { Pool } from 'pg';

const connectionString = process.env.DB_URL || process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/project';

if (!process.env.DB_URL && !process.env.DATABASE_URL) {
  console.warn('No DB_URL or DATABASE_URL was provided; using default local connection to the project database.');
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
    INSERT INTO organization (name, description, contact_email, logo_filename)
    SELECT 'BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'
    WHERE NOT EXISTS (SELECT 1 FROM organization WHERE name = 'BrightFuture Builders');
  `);

  await pool.query(`
    INSERT INTO organization (name, description, contact_email, logo_filename)
    SELECT 'GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'
    WHERE NOT EXISTS (SELECT 1 FROM organization WHERE name = 'GreenHarvest Growers');
  `);

  await pool.query(`
    INSERT INTO organization (name, description, contact_email, logo_filename)
    SELECT 'UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png'
    WHERE NOT EXISTS (SELECT 1 FROM organization WHERE name = 'UnityServe Volunteers');
  `);

  await pool.query(`
    INSERT INTO project (organization_id, title, description, location, project_date)
    SELECT organization_id, 'Community Garden Build', 'Volunteers helped prepare planting beds and install irrigation for a neighborhood garden.', 'Riverside Community Center', '2026-05-15'
    FROM organization
    WHERE name = 'GreenHarvest Growers'
      AND NOT EXISTS (
        SELECT 1 FROM project WHERE title = 'Community Garden Build'
      );
  `);

  await pool.query(`
    INSERT INTO project (organization_id, title, description, location, project_date)
    SELECT organization_id, 'School Supply Drive', 'A weekend effort to collect and distribute school supplies to local students.', 'Northside Elementary', '2026-06-20'
    FROM organization
    WHERE name = 'UnityServe Volunteers'
      AND NOT EXISTS (
        SELECT 1 FROM project WHERE title = 'School Supply Drive'
      );
  `);

  await pool.query(`
    INSERT INTO project (organization_id, title, description, location, project_date)
    SELECT organization_id, 'Neighborhood Park Cleanup', 'Community members removed debris, planted flowers, and refreshed park walkways.', 'Maple Grove Park', '2026-07-04'
    FROM organization
    WHERE name = 'BrightFuture Builders'
      AND NOT EXISTS (
        SELECT 1 FROM project WHERE title = 'Neighborhood Park Cleanup'
      );
  `);
};

export { pool as default, testConnection, initializeDatabase };