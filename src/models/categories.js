import { query } from './dg.js';

const getAllCategories = async () => {
  const sql = `
    SELECT
      category_id,
      category_name
    FROM category
    ORDER BY category_name;
  `;

  const result = await query(sql);
  return result.rows;
};

const getCategoryDetails = async (categoryId) => {
  const sql = `
    SELECT
      category_id,
      category_name
    FROM category
    WHERE category_id = $1;
  `;

  const result = await query(sql, [categoryId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
  const sql = `
    SELECT
      c.category_id,
      c.category_name
    FROM project_category AS pc
    JOIN category AS c
      ON pc.category_id = c.category_id
    WHERE pc.project_id = $1
    ORDER BY c.category_name;
  `;

  const result = await query(sql, [projectId]);
  return result.rows;
};

export {
  getAllCategories,
  getCategoryDetails,
  getCategoriesByProjectId,
};