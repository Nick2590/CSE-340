import { query } from './dg.js';

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
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export { getAllProjects };