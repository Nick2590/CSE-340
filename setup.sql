
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

CREATE TABLE organizations (
  organization_id SERIAL,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  logo_filename VARCHAR(255) NOT NULL,
  CONSTRAINT pk_organizations PRIMARY KEY (organization_id)
);

CREATE TABLE categories (
  category_id SERIAL,
  category_name VARCHAR(100) NOT NULL,
  CONSTRAINT pk_categories PRIMARY KEY (category_id),
  CONSTRAINT uq_categories_category_name UNIQUE (category_name)
);

CREATE TABLE projects (
  project_id SERIAL,
  organization_id INTEGER NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  project_date DATE NOT NULL,
  CONSTRAINT pk_projects PRIMARY KEY (project_id),
  CONSTRAINT fk_projects_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id)
);

CREATE TABLE project_categories (
  project_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  CONSTRAINT pk_project_categories
    PRIMARY KEY (project_id, category_id),
  CONSTRAINT fk_project_categories_project
    FOREIGN KEY (project_id)
    REFERENCES projects(project_id),
  CONSTRAINT fk_project_categories_category
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
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

INSERT INTO projects (organization_id, title, description, location, project_date)
VALUES
  (1, 'Neighborhood Park Cleanup', 'Community members removed debris, planted flowers, and refreshed park walkways.', 'Maple Grove Park', '2026-07-04'),
  (2, 'Community Garden Build', 'Volunteers helped prepare planting beds and install irrigation for a neighborhood garden.', 'Riverside Community Center', '2026-05-15'),
  (3, 'School Supply Drive', 'A weekend effort to collect and distribute school supplies to local students.', 'Northside Elementary', '2026-06-20'),
  (1, 'Health Fair Support', 'Volunteers set up screening stations and shared wellness resources with residents.', 'Cedar Street Community Center', '2026-08-12');

INSERT INTO project_categories (project_id, category_id)
VALUES
  (1, 1),
  (1, 2),
  (2, 1),
  (3, 2),
  (4, 3);