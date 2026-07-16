
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(organization_id),
  category_id INTEGER NOT NULL REFERENCES categories(category_id),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  project_date DATE NOT NULL
);

INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES
  ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
  ('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
  ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

INSERT INTO categories (category_name)
VALUES
  ('Environment'),
  ('Education'),
  ('Community Health');

INSERT INTO projects (organization_id, category_id, title, description, location, project_date)
VALUES
  (1, 1, 'Neighborhood Park Cleanup', 'Community members removed debris, planted flowers, and refreshed park walkways.', 'Maple Grove Park', '2026-07-04'),
  (2, 1, 'Community Garden Build', 'Volunteers helped prepare planting beds and install irrigation for a neighborhood garden.', 'Riverside Community Center', '2026-05-15'),
  (3, 2, 'School Supply Drive', 'A weekend effort to collect and distribute school supplies to local students.', 'Northside Elementary', '2026-06-20'),
  (1, 3, 'Health Fair Support', 'Volunteers set up screening stations and shared wellness resources with residents.', 'Cedar Street Community Center', '2026-08-12');