import {
  createCategory,
  getAllCategories,
  getCategoriesByProjectId,
  getCategoryDetails,
  updateCategory,
  updateCategoryAssignments,
} from '../models/categories.js';
import {
  getProjectDetails,
  getProjectsByCategoryId,
} from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
  body('categoryName')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters')
    .escape(),
];

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

const showNewCategoryForm = async (req, res) => {
  const title = 'Add New Category';

  res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res, next) => {
  try {
    const results = validationResult(req);

    if (!results.isEmpty()) {
      results.array().forEach((error) => {
        req.flash('error', error.msg);
      });

      return res.redirect('/new-category');
    }

    const { categoryName } = req.body;

    await createCategory(categoryName);

    req.flash('success', 'Category added successfully!');

    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
};

const showEditCategoryForm = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await getCategoryDetails(id);

    if (!category) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }

    const title = 'Edit Category';

    res.render('edit-category', {
      title,
      category,
    });
  } catch (error) {
    next(error);
  }
};

const processEditCategoryForm = async (req, res, next) => {
  try {
    const id = req.params.id;
    const results = validationResult(req);

    if (!results.isEmpty()) {
      results.array().forEach((error) => {
        req.flash('error', error.msg);
      });

      return res.redirect(`/edit-category/${id}`);
    }

    const { categoryName } = req.body;

    await updateCategory(id, categoryName);

    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${id}`);
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
  categoryValidation,
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
