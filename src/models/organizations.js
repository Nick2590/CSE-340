import { query } from './dg.js';

const fallbackOrganizations = [
  {
    organization_id: 1,
    name: 'BrightFuture Builders',
    description: 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    contact_email: 'info@brightfuturebuilders.org',
    logo_filename: 'brightfuture-logo.png',
  },
  {
    organization_id: 2,
    name: 'GreenHarvest Growers',
    description: 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    contact_email: 'contact@greenharvest.org',
    logo_filename: 'greenharvest-logo.png',
  },
  {
    organization_id: 3,
    name: 'UnityServe Volunteers',
    description: 'A volunteer coordination group supporting local charities and service initiatives.',
    contact_email: 'hello@unityserve.org',
    logo_filename: 'unityserve-logo.png',
  },
];

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
    console.warn('Falling back to sample organizations:', error.message);
    return fallbackOrganizations;
  }
};

const getOrganizationDetails = async (organizationId) => {
  try {
    const sql = `
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM organizations
      WHERE organization_id = $1;
    `;

    const result = await query(sql, [organizationId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.warn('Falling back to sample organization detail:', error.message);
    return fallbackOrganizations.find((organization) => String(organization.organization_id) === String(organizationId)) || null;
  }
};

export {
  getAllOrganizations,
  getOrganizationDetails,
};
