import { query } from './dg.js';

const getAllProjects = async () => {
  const sql = `
    SELECT 
      project.project_id,
      project.title,
      project.description,
      project.location,
      project.project_date,
      organization.name AS organization_name
    FROM project
    JOIN organization
      ON project.organization_id = organization.organization_id
    ORDER BY project.project_date;
  `;

  const result = await query(sql);
  return result.rows;
};

export { getAllProjects };