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

const createOrganization = async (
  name,
  description,
  contactEmail,
  logoFilename,
) => {
  const sql = `
    INSERT INTO organization (
      name,
      description,
      contact_email,
      logo_filename
    )
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id;
  `;

  const queryParams = [
    name,
    description,
    contactEmail,
    logoFilename,
  ];

  const result = await query(sql, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create organization');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log(
      'Created new organization with ID:',
      result.rows[0].organization_id,
    );
  }

  return result.rows[0].organization_id;
};

const updateOrganization = async (
  id,
  name,
  description,
  contactEmail,
  logoFilename,
) => {
  const sql = `
    UPDATE organization
    SET
      name = $1,
      description = $2,
      contact_email = $3,
      logo_filename = $4
    WHERE organization_id = $5;
  `;

  const queryParams = [
    name,
    description,
    contactEmail,
    logoFilename,
    id,
  ];

  await query(sql, queryParams);
};

export {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization,
};
