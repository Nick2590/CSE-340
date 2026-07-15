import { query } from './dg.js';

const getAllOrganizations = async () => {
  try {
    const sql = `
      SELECT organization_id, name, description, contact_email, logo_filename
      FROM organizations
      ORDER BY name;
    `;

    const result = await query(sql);
    return result.rows;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};

export { getAllOrganizations };
