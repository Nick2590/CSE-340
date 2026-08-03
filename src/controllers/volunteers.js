import { getProjectDetails } from '../models/projects.js';
import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

const getProjectId = (req) => {
  const projectId = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(projectId) || projectId < 1) {
    const error = new Error('Invalid Project ID');
    error.status = 400;
    throw error;
  }

  return projectId;
};

const getUserId = (req) => {
  const userId = req.session?.user?.user_id;

  if (!userId) {
    const error = new Error('You must log in to volunteer for a project.');
    error.status = 401;
    throw error;
  }

  return userId;
};

const getRedirectPath = (projectId, returnTo) => (
  returnTo === 'dashboard' ? '/dashboard' : `/project/${projectId}`
);

const ensureProjectExists = async (projectId) => {
  const project = await getProjectDetails(projectId);

  if (!project) {
    const error = new Error('Project Not Found');
    error.status = 404;
    throw error;
  }
};

const processVolunteerSignup = async (req, res, next) => {
  try {
    const projectId = getProjectId(req);
    const userId = getUserId(req);

    await ensureProjectExists(projectId);

    const volunteerRegistration = await addVolunteer(userId, projectId);

    if (volunteerRegistration) {
      req.flash('success', 'You have signed up to volunteer for this project.');
    } else {
      req.flash('info', 'You are already volunteering for this project.');
    }

    res.redirect(getRedirectPath(projectId, req.body.returnTo));
  } catch (error) {
    next(error);
  }
};

const processVolunteerRemoval = async (req, res, next) => {
  try {
    const projectId = getProjectId(req);
    const userId = getUserId(req);

    await ensureProjectExists(projectId);

    const removedVolunteer = await removeVolunteer(userId, projectId);

    if (removedVolunteer) {
      req.flash('success', 'You have been removed from this volunteer project.');
    } else {
      req.flash('info', 'You are not currently volunteering for this project.');
    }

    res.redirect(getRedirectPath(projectId, req.body.returnTo));
  } catch (error) {
    next(error);
  }
};

export {
  processVolunteerSignup,
  processVolunteerRemoval,
};