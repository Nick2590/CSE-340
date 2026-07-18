import {
  getAllOrganizations,
  getOrganizationDetails,
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations, NODE_ENV: process.env.NODE_ENV?.toLowerCase() || 'production' });
  } catch (error) {
    next(error);
  }
};

const showOrganizationDetailsPage = async (req, res, next) => {
  try {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    if (!organizationDetails) {
      const err = new Error('Organization Not Found');
      err.status = 404;
      return next(err);
    }

    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {
      title,
      organizationDetails,
      projects,
      NODE_ENV: process.env.NODE_ENV?.toLowerCase() || 'production',
    });
  } catch (error) {
    next(error);
  }
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
};
