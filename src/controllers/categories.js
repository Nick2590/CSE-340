import {
  getAllCategories,
  getCategoriesByProjectId,
  getCategoryDetails,
  updateCategoryAssignments,
} from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';

const showCategoriesPage = async (req, res, next) => {
  try {
    const title = 'Service Project Categories';
    const categories = await getAllCategories();

    res.render('categories', {
      title,
      categories,
      NODE_ENV: process.env.NODE_ENV?.toLowerCase() || 'production',
    });
  } catch (error) {
    next(error);
  }
};

const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryDetails(categoryId);

    if (!category) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
      title: category.category_name,
      category,
      projects,
      NODE_ENV: process.env.NODE_ENV?.toLowerCase() || 'production',
    });
  } catch (error) {
    next(error);
  }
};

const showAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
      title,
      project,
      categories,
      assignedCategories,
    });
  } catch (error) {
    next(error);
  }
};

const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const rawCategoryIds = req.body.categoryIds;

    const categoryIds = rawCategoryIds
      ? Array.isArray(rawCategoryIds)
        ? rawCategoryIds
        : [rawCategoryIds]
      : [];

    await updateCategoryAssignments(projectId, categoryIds);

    req.flash('success', 'Project categories updated successfully!');

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
