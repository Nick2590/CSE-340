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

const getOrganizationDetails = async (organizationId) => {
  const sql = `
    SELECT
      organization_id,
      name,
      description,
      contact_email,
      logo_filename
    FROM organization
    WHERE organization_id = $1;
  `;

  const result = await query(sql, [organizationId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export {
  getAllOrganizations,
  getOrganizationDetails,
};
