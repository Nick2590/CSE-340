import { query } from './dg.js';

const getAllProjects = async () => {
  const sql = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date AS date,
      o.name AS organization_name,
      STRING_AGG(c.category_name, ', ' ORDER BY c.category_name) AS category_name
    FROM project AS p
    JOIN organization AS o
      ON p.organization_id = o.organization_id
    LEFT JOIN project_category AS pc
      ON p.project_id = pc.project_id
    LEFT JOIN category AS c
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
};

const getProjectsByOrganizationId = async (organizationId) => {
  const sql = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      location,
      project_date AS date
    FROM project
    WHERE organization_id = $1
    ORDER BY project_date;
  `;

  const result = await query(sql, [organizationId]);
  return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
  const sql = `
    SELECT
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.project_date AS date,
      o.name AS organization_name
    FROM project_category AS pc
    JOIN project AS p
      ON pc.project_id = p.project_id
    JOIN organization AS o
      ON p.organization_id = o.organization_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date, p.title;
  `;

  const result = await query(sql, [categoryId]);
  return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const limit = Number.parseInt(number_of_projects, 10);

  if (Number.isNaN(limit) || limit < 1) {
    return [];
  }

  const sql = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.project_date AS date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM project AS p
    JOIN organization AS o
      ON p.organization_id = o.organization_id
    ORDER BY p.project_date ASC
    LIMIT $1;
  `;

  const result = await query(sql, [limit]);
  return result.rows;
};

const getProjectDetails = async (id) => {
  const sql = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.project_date AS date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM project AS p
    JOIN organization AS o
      ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const result = await query(sql, [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getProjectsByCategoryId,
  getUpcomingProjects,
  getProjectDetails,
};