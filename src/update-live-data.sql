BEGIN;

-- Insert only missing organizations from the full seed set.
WITH seed_organization (name, description, contact_email, logo_filename) AS (
  VALUES
    ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
    ('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
    ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png'),
    ('HelpingHands Outreach', 'Coordinates neighborhood outreach events that provide food, clothing, and referral services for families in need.', 'connect@helpinghandsoutreach.org', 'helpinghands-logo.png'),
    ('HopeBridge Mentors', 'Pairs trained mentors with youth to support academic growth, leadership development, and career readiness.', 'team@hopebridgementors.org', 'hopebridge-logo.png'),
    ('CareCircle Relief', 'Organizes volunteer teams for emergency relief, community recovery projects, and supply distribution.', 'support@carecirclerelief.org', 'carecircle-logo.png'),
    ('RiverCity Tutors', 'Provides free after-school tutoring and literacy programs for elementary and middle school students.', 'info@rivercitytutors.org', 'rivercity-logo.png'),
    ('MealsForNeighbors Network', 'Delivers nutritious meals and wellness check-ins to seniors and homebound residents.', 'hello@mealsforneighbors.org', 'mealsforneighbors-logo.png'),
    ('SafeHarbor Housing Aid', 'Mobilizes volunteers to repair transitional housing and assist residents moving into stable homes.', 'contact@safeharborhousing.org', 'safeharbor-logo.png'),
    ('TechAccess Community Lab', 'Expands digital equity by offering device refurbishment, internet access support, and tech training.', 'reach@techaccesslab.org', 'techaccess-logo.png'),
    ('OpenArms Refugee Support', 'Supports refugee families with language assistance, job-readiness workshops, and resettlement resources.', 'welcome@openarmssupport.org', 'openarms-logo.png'),
    ('CleanStreets Collective', 'Leads local cleanup drives, recycling education, and beautification efforts in public spaces.', 'volunteer@cleanstreetscollective.org', 'cleanstreets-logo.png'),
    ('HealthLink Mobile Clinic', 'Coordinates mobile wellness services, screenings, and preventive health education across neighborhoods.', 'care@healthlinkmobile.org', 'healthlink-logo.png'),
    ('VeteransForward Alliance', 'Connects veterans with housing, career, and peer-support services through community partnerships.', 'service@veteransforward.org', 'veteransforward-logo.png'),
    ('YouthBuild Action Team', 'Engages teens in supervised service projects focused on civic leadership and community improvement.', 'join@youthbuildaction.org', 'youthbuild-logo.png')
)
INSERT INTO organization (name, description, contact_email, logo_filename)
SELECT s.name, s.description, s.contact_email, s.logo_filename
FROM seed_organization AS s
WHERE NOT EXISTS (
  SELECT 1
  FROM organization AS o
  WHERE o.contact_email = s.contact_email
);

-- Insert missing categories only.
INSERT INTO category (category_name)
SELECT v.category_name
FROM (VALUES ('Environment'), ('Education'), ('Community Health')) AS v(category_name)
WHERE NOT EXISTS (
  SELECT 1
  FROM category AS c
  WHERE c.category_name = v.category_name
);

-- Insert missing projects only, resolving organization_id by contact_email.
WITH seed_project (organization_email, title, description, location, project_date) AS (
  VALUES
    ('info@brightfuturebuilders.org', 'Neighborhood Park Cleanup', 'Community members removed debris, planted flowers, and refreshed park walkways.', 'Maple Grove Park', DATE '2026-07-04'),
    ('contact@greenharvest.org', 'Community Garden Build', 'Volunteers helped prepare planting beds and install irrigation for a neighborhood garden.', 'Riverside Community Center', DATE '2026-05-15'),
    ('hello@unityserve.org', 'School Supply Drive', 'A weekend effort to collect and distribute school supplies to local students.', 'Northside Elementary', DATE '2026-06-20'),
    ('info@brightfuturebuilders.org', 'Health Fair Support', 'Volunteers set up screening stations and shared wellness resources with residents.', 'Cedar Street Community Center', DATE '2026-08-12')
)
INSERT INTO project (organization_id, title, description, location, project_date)
SELECT o.organization_id, sp.title, sp.description, sp.location, sp.project_date
FROM seed_project AS sp
JOIN organization AS o
  ON o.contact_email = sp.organization_email
WHERE NOT EXISTS (
  SELECT 1
  FROM project AS p
  WHERE p.organization_id = o.organization_id
    AND p.title = sp.title
    AND p.project_date = sp.project_date
);

-- Insert required project-category relationships only when missing.
WITH seed_project_category (organization_email, project_title, project_date, category_name) AS (
  VALUES
    ('info@brightfuturebuilders.org', 'Neighborhood Park Cleanup', DATE '2026-07-04', 'Environment'),
    ('info@brightfuturebuilders.org', 'Neighborhood Park Cleanup', DATE '2026-07-04', 'Education'),
    ('contact@greenharvest.org', 'Community Garden Build', DATE '2026-05-15', 'Environment'),
    ('hello@unityserve.org', 'School Supply Drive', DATE '2026-06-20', 'Education'),
    ('info@brightfuturebuilders.org', 'Health Fair Support', DATE '2026-08-12', 'Community Health')
), resolved_pairs AS (
  SELECT
    p.project_id,
    c.category_id
  FROM seed_project_category AS spc
  JOIN organization AS o
    ON o.contact_email = spc.organization_email
  JOIN project AS p
    ON p.organization_id = o.organization_id
   AND p.title = spc.project_title
   AND p.project_date = spc.project_date
  JOIN category AS c
    ON c.category_name = spc.category_name
)
INSERT INTO project_category (project_id, category_id)
SELECT rp.project_id, rp.category_id
FROM resolved_pairs AS rp
WHERE NOT EXISTS (
  SELECT 1
  FROM project_category AS pc
  WHERE pc.project_id = rp.project_id
    AND pc.category_id = rp.category_id
);

COMMIT;
