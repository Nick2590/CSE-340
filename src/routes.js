import express from 'express';
import {
  categoryValidation,
  processEditCategoryForm,
  processNewCategoryForm,
  processAssignCategoriesForm,
  showEditCategoryForm,
  showAssignCategoriesForm,
  showNewCategoryForm,
  showCategoriesPage,
  showCategoryDetailsPage,
} from './controllers/categories.js';
import { showHomePage } from './controllers/index.js';
import {
  organizationValidation,
  processEditOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  showNewOrganizationForm,
  showOrganizationDetailsPage,
  showOrganizationsPage,
} from './controllers/organizations.js';
import {
  processEditProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  showProjectDetailsPage,
  showNewProjectForm,
  showProjectsPage,
} from './controllers/projects.js';
import {
  processVolunteerSignup,
  processVolunteerRemoval,
} from './controllers/volunteers.js';
import { testErrorPage } from './controllers/errors.js';
import {
  processLoginForm,
  processLogout,
  processUserRegistrationForm,
  requireLogin,
  requireRole,
  showDashboard,
  showLoginForm,
  showUsersPage,
  showUserRegistrationForm,
  userValidation,
} from './controllers/users.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);
router.get('/register', showUserRegistrationForm);
router.post('/register', userValidation, processUserRegistrationForm);
router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
router.get('/project/:id', showProjectDetailsPage);
router.post('/project/:id/volunteer', requireLogin, processVolunteerSignup);
router.post('/project/:id/unvolunteer', requireLogin, processVolunteerRemoval);
router.get('/project/:projectId/assign-categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', requireRole('admin'), processAssignCategoriesForm);
router.get('/categories', showCategoriesPage);
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/test-error', testErrorPage);

export default router;
