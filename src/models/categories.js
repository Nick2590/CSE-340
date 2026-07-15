import { query } from './dg.js';

const getAllCategories = async () => {
  try {
    const sql = `
      SELECT
        category_id,
        category_name
      FROM categories
      ORDER BY category_name;
    `;

    const result = await query(sql);
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export { getAllCategories };