
-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png')
ON CONFLICT DO NOTHING;

-- ========================================
-- Project Table
-- ========================================
CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL
);

-- ========================================
-- Insert sample data: Projects
-- ========================================
INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Community Garden Build', 'Volunteers helped prepare planting beds and install irrigation for a neighborhood garden.', 'Riverside Community Center', '2026-05-15'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'School Supply Drive', 'A weekend effort to collect and distribute school supplies to local students.', 'Northside Elementary', '2026-06-20'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Neighborhood Park Cleanup', 'Community members removed debris, planted flowers, and refreshed park walkways.', 'Maple Grove Park', '2026-07-04')
ON CONFLICT DO NOTHING;

SELECT * FROM organization;
SELECT * FROM project;