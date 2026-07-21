import {
  createProject,
  getProjectDetails,
  getUpcomingProjects,
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Project title must be between 3 and 200 characters')
    .escape(),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 1000 })
    .withMessage('Project description cannot exceed 1000 characters')
    .escape(),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Project location is required')
    .isLength({ max: 200 })
    .withMessage('Project location cannot exceed 200 characters')
    .escape(),

  body('date')
    .notEmpty()
    .withMessage('Project date is required')
    .isISO8601()
    .withMessage('Please provide a valid project date'),

  body('organizationId')
    .notEmpty()
    .withMessage('Organization is required')
    .isInt({ min: 1 })
    .withMessage('Please select a valid organization'),
];

const showProjectsPage = async (req, res, next) => {
  try {
    const title = 'Upcoming Service Projects';
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', {
      title,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

const showNewProjectForm = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', {
      title,
      organizations,
    });
  } catch (error) {
    next(error);
  }
};

const processNewProjectForm = async (req, res, next) => {
  try {
    const results = validationResult(req);

    if (!results.isEmpty()) {
      results.array().forEach((error) => {
        req.flash('error', error.msg);
      });

      return res.redirect('/new-project');
    }

    const {
      organizationId,
      title,
      description,
      location,
      date,
    } = req.body;

    await createProject(
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash('success', 'Service project added successfully!');

    res.redirect('/projects');
  } catch (error) {
    next(error);
  }
};

const showProjectDetailsPage = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    const categories = await getCategoriesByProjectId(projectId);
    const title = project.title;

    res.render('project', {
      title,
      project,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export {
  projectValidation,
  showProjectsPage,
  showNewProjectForm,
  processNewProjectForm,
  showProjectDetailsPage,
};
