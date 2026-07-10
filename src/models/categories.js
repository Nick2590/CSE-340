import db from './dg.js'

const getAllCategories = async () => {
    const sql = `
        SELECT
            category_id,
            category_name
        FROM category
        ORDER BY category_name;
    `;

    const result = await pool.query(sql);
    return result.rows;
};

export { getAllCategories };