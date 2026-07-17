
-- ========================================
-- CSE 340 Database Setup
-- ========================================

-- Drop tables in dependency order
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS organization;


-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL,

    CONSTRAINT pk_organization
        PRIMARY KEY (organization_id),

    CONSTRAINT uq_organization_contact_email
        UNIQUE (contact_email)
);


-- ========================================
-- Project Table
-- ========================================

CREATE TABLE project (
    project_id SERIAL,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT pk_project
        PRIMARY KEY (project_id),

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


-- ========================================
-- Category Table
-- ========================================

CREATE TABLE category (
    category_id SERIAL,
    category_name VARCHAR(100) NOT NULL,

    CONSTRAINT pk_category
        PRIMARY KEY (category_id),

    CONSTRAINT uq_category_name
        UNIQUE (category_name)
);


-- ========================================
-- Project-Category Junction Table
-- ========================================

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    CONSTRAINT pk_project_category
        PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);


-- ========================================
-- Insert 15 Organizations
-- ========================================

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
),
(
    'HelpingHands Outreach',
    'Coordinates neighborhood outreach events that provide food, clothing, and support for families in need.',
    'connect@helpinghandsoutreach.org',
    'helpinghands-logo.png'
),
(
    'HopeBridge Mentors',
    'Pairs trained mentors with youth to support academic growth, leadership development, and career readiness.',
    'team@hopebridgementors.org',
    'hopebridge-logo.png'
),
(
    'CareCircle Relief',
    'Organizes volunteer teams for emergency relief, community recovery projects, and supply distribution.',
    'support@carecirclerelief.org',
    'carecircle-logo.png'
),
(
    'RiverCity Tutors',
    'Provides free after-school tutoring and literacy programs for elementary and middle school students.',
    'info@rivercitytutors.org',
    'rivercity-logo.png'
),
(
    'MealsForNeighbors Network',
    'Delivers nutritious meals and wellness check-ins to seniors and homebound residents.',
    'hello@mealsforneighbors.org',
    'mealsforneighbors-logo.png'
),
(
    'SafeHarbor Housing Aid',
    'Mobilizes volunteers to repair transitional housing and assist residents moving into stable homes.',
    'contact@safeharborhousing.org',
    'safeharbor-logo.png'
),
(
    'TechAccess Community Lab',
    'Expands digital access by offering device refurbishment, internet support, and technology training.',
    'reach@techaccesslab.org',
    'techaccess-logo.png'
),
(
    'OpenArms Refugee Support',
    'Supports refugee families with language assistance, job-readiness workshops, and resettlement resources.',
    'welcome@openarmssupport.org',
    'openarms-logo.png'
),
(
    'CleanStreets Collective',
    'Leads local cleanup drives, recycling education, and beautification efforts in public spaces.',
    'volunteer@cleanstreetscollective.org',
    'cleanstreets-logo.png'
),
(
    'HealthLink Mobile Clinic',
    'Coordinates mobile wellness services, screenings, and preventive health education across neighborhoods.',
    'care@healthlinkmobile.org',
    'healthlink-logo.png'
),
(
    'VeteransForward Alliance',
    'Connects veterans with housing, career, and peer-support services through community partnerships.',
    'service@veteransforward.org',
    'veteransforward-logo.png'
),
(
    'YouthBuild Action Team',
    'Engages teens in supervised service projects focused on civic leadership and community improvement.',
    'join@youthbuildaction.org',
    'youthbuild-logo.png'
);


-- ========================================
-- Insert 15 Projects
-- ========================================

INSERT INTO project (
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES
(
    1,
    'Community Park Cleanup',
    'Clean up trash and improve the local park.',
    'Phoenix, AZ',
    '2026-08-10'
),
(
    1,
    'Neighborhood Fence Repair',
    'Help repair fences for families in need.',
    'Mesa, AZ',
    '2026-08-15'
),
(
    1,
    'School Painting Project',
    'Paint classrooms and hallways at a local school.',
    'Tempe, AZ',
    '2026-08-20'
),
(
    1,
    'Playground Build',
    'Help build a small playground for children.',
    'Glendale, AZ',
    '2026-08-25'
),
(
    1,
    'Community Garden Boxes',
    'Build garden boxes for a neighborhood garden.',
    'Chandler, AZ',
    '2026-08-30'
),
(
    2,
    'Urban Garden Planting',
    'Plant vegetables for a community food garden.',
    'Phoenix, AZ',
    '2026-09-05'
),
(
    2,
    'Food Sustainability Workshop',
    'Teach families about growing food at home.',
    'Mesa, AZ',
    '2026-09-10'
),
(
    2,
    'Farmers Market Support',
    'Help organize booths and supplies.',
    'Tempe, AZ',
    '2026-09-15'
),
(
    2,
    'Compost Education Day',
    'Teach residents how to compost food scraps.',
    'Gilbert, AZ',
    '2026-09-20'
),
(
    2,
    'Harvest Donation Drive',
    'Collect fresh food donations for local families.',
    'Chandler, AZ',
    '2026-09-25'
),
(
    3,
    'Charity Supply Sorting',
    'Sort donated clothes and supplies.',
    'Phoenix, AZ',
    '2026-10-01'
),
(
    3,
    'Senior Center Visit',
    'Visit and serve seniors in the community.',
    'Mesa, AZ',
    '2026-10-06'
),
(
    3,
    'Homeless Shelter Meal Prep',
    'Prepare meals for people in need.',
    'Tempe, AZ',
    '2026-10-11'
),
(
    3,
    'Youth Service Day',
    'Coordinate youth volunteers for local service.',
    'Glendale, AZ',
    '2026-10-16'
),
(
    3,
    'Donation Pickup Route',
    'Pick up donated items from local homes.',
    'Chandler, AZ',
    '2026-10-21'
);


-- ========================================
-- Insert Categories
-- ========================================

INSERT INTO category (category_name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');


-- ========================================
-- Connect Projects to Categories
-- ========================================

INSERT INTO project_category (
    project_id,
    category_id
)
VALUES
    -- BrightFuture Builders projects
    (1, 1),
    (1, 3),

    (2, 3),

    (3, 2),
    (3, 3),

    (4, 3),

    (5, 1),

    -- GreenHarvest Growers projects
    (6, 1),

    (7, 2),

    (8, 3),

    (9, 1),
    (9, 2),

    (10, 1),
    (10, 3),

    -- UnityServe Volunteers projects
    (11, 3),

    (12, 3),
    (12, 4),

    (13, 3),
    (13, 4),

    (14, 2),
    (14, 3),

    (15, 3);


-- ========================================
-- Verification Queries
-- ========================================

-- Verify organization count
SELECT COUNT(*) AS organization_count
FROM organization;

-- Verify project count
SELECT COUNT(*) AS project_count
FROM project;

-- Verify category count
SELECT COUNT(*) AS category_count
FROM category;

-- Verify project-category relationships
SELECT COUNT(*) AS project_category_count
FROM project_category;


-- ========================================
-- Display Organizations
-- ========================================

SELECT *
FROM organization
ORDER BY organization_id;


-- ========================================
-- Display Projects with Organizations
-- ========================================

SELECT
    p.project_id,
    p.title,
    p.description,
    p.location,
    p.project_date,
    p.organization_id,
    o.name AS organization_name
FROM project AS p
JOIN organization AS o
    ON p.organization_id = o.organization_id
ORDER BY p.project_date;


-- ========================================
-- Display Categories
-- ========================================

SELECT *
FROM category
ORDER BY category_id;


-- ========================================
-- Display Projects with Categories
-- ========================================

SELECT
    p.project_id,
    p.title,
    c.category_id,
    c.category_name
FROM project AS p
JOIN project_category AS pc
    ON p.project_id = pc.project_id
JOIN category AS c
    ON pc.category_id = c.category_id
ORDER BY p.project_id, c.category_name;


-- ========================================
-- Verify Every Project Has a Category
-- ========================================

SELECT
    p.project_id,
    p.title
FROM project AS p
LEFT JOIN project_category AS pc
    ON p.project_id = pc.project_id
WHERE pc.category_id IS NULL;