import { query } from './dg.js';

const fallbackCategories = [
  { category_id: 1, category_name: 'Environment' },
  { category_id: 2, category_name: 'Education' },
  { category_id: 3, category_name: 'Community Health' },
];

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
    console.warn('Falling back to sample categories:', error.message);
    return fallbackCategories;
  }
};

export { getAllCategories };