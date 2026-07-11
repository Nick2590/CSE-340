import { query } from './dg.js';

const getAllOrganizations = async () => {
    const sql = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        ORDER BY name;
    `;

    const result = await query(sql);
    return result.rows;
};

export { getAllOrganizations };
