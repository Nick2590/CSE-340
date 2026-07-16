import { query } from './dg.js';

const fallbackProjects = [
  {
    project_id: 1,
    organization_id: 1,
    title: 'Neighborhood Park Cleanup',
    description: 'Community members removed debris, planted flowers, and refreshed park walkways.',
    location: 'Maple Grove Park',
    date: '2026-07-04',
    organization_name: 'BrightFuture Builders',
    category_name: 'Environment',
  },
  {
    project_id: 2,
    organization_id: 2,
    title: 'Community Garden Build',
    description: 'Volunteers helped prepare planting beds and install irrigation for a neighborhood garden.',
    location: 'Riverside Community Center',
    date: '2026-05-15',
    organization_name: 'GreenHarvest Growers',
    category_name: 'Environment',
  },
  {
    project_id: 3,
    organization_id: 3,
    title: 'School Supply Drive',
    description: 'A weekend effort to collect and distribute school supplies to local students.',
    location: 'Northside Elementary',
    date: '2026-06-20',
    organization_name: 'UnityServe Volunteers',
    category_name: 'Education',
  },
  {
    project_id: 4,
    organization_id: 1,
    title: 'Health Fair Support',
    description: 'Volunteers set up screening stations and shared wellness resources with residents.',
    location: 'Cedar Street Community Center',
    date: '2026-08-12',
    organization_name: 'BrightFuture Builders',
    category_name: 'Community Health',
  },
];

const getAllProjects = async () => {
  try {
    const sql = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.project_date,
        o.name AS organization_name,
        c.category_name
      FROM projects AS p
      JOIN organizations AS o
        ON p.organization_id = o.organization_id
      JOIN categories AS c
        ON p.category_id = c.category_id
      ORDER BY p.project_date DESC, p.title;
    `;

    const result = await query(sql);
    return result.rows;
  } catch (error) {
    console.warn('Falling back to sample projects:', error.message);
    return fallbackProjects;
  }
};

const getProjectsByOrganizationId = async (organizationId) => {
  try {
    const sql = `
      SELECT
        project_id,
        organization_id,
        title,
        description,
        location,
        project_date AS date
      FROM projects
      WHERE organization_id = $1
      ORDER BY project_date;
    `;

    const result = await query(sql, [organizationId]);
    return result.rows;
  } catch (error) {
    console.warn('Falling back to sample organization projects:', error.message);
    return fallbackProjects.filter((project) => String(project.organization_id) === String(organizationId));
  }
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
};