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
        p.project_date AS date,
        o.name AS organization_name,
        STRING_AGG(c.category_name, ', ' ORDER BY c.category_name) AS category_name
      FROM projects AS p
      JOIN organizations AS o
        ON p.organization_id = o.organization_id
      LEFT JOIN project_categories AS pc
        ON p.project_id = pc.project_id
      LEFT JOIN categories AS c
        ON pc.category_id = c.category_id
      GROUP BY
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.project_date,
        o.name
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

const getUpcomingProjects = async (number_of_projects) => {
  const limit = Number.parseInt(number_of_projects, 10);

  if (Number.isNaN(limit) || limit < 1) {
    return [];
  }

  try {
    const sql = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.project_date AS date,
        p.location,
        p.organization_id,
        o.name AS organization_name
      FROM projects AS p
      JOIN organizations AS o
        ON p.organization_id = o.organization_id
      WHERE p.project_date >= CURRENT_DATE
      ORDER BY p.project_date ASC
      LIMIT $1;
    `;

    const result = await query(sql, [limit]);
    return result.rows;
  } catch (error) {
    console.warn('Falling back to sample upcoming projects:', error.message);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return fallbackProjects
      .filter((project) => {
        const projectDate = new Date(project.date);
        projectDate.setHours(0, 0, 0, 0);
        return projectDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit)
      .map((project) => ({
        project_id: project.project_id,
        title: project.title,
        description: project.description,
        date: project.date,
        location: project.location,
        organization_id: project.organization_id,
        organization_name: project.organization_name,
      }));
  }
};

const getProjectDetails = async (id) => {
  try {
    const sql = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.project_date AS date,
        p.location,
        p.organization_id,
        o.name AS organization_name
      FROM projects AS p
      JOIN organizations AS o
        ON p.organization_id = o.organization_id
      WHERE p.project_id = $1;
    `;

    const result = await query(sql, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.warn('Falling back to sample project details:', error.message);

    const fallbackProject = fallbackProjects.find((project) => String(project.project_id) === String(id));
    if (!fallbackProject) {
      return null;
    }

    return {
      project_id: fallbackProject.project_id,
      title: fallbackProject.title,
      description: fallbackProject.description,
      date: fallbackProject.date,
      location: fallbackProject.location,
      organization_id: fallbackProject.organization_id,
      organization_name: fallbackProject.organization_name,
    };
  }
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
};