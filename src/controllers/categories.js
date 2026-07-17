import {
  getAllCategories,
  getCategoryDetails,
} from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
  try {
    const title = 'Service Project Categories';
    const categories = await getAllCategories();

    res.render('categories', {
      title,
      categories,
      NODE_ENV: process.env.NODE_ENV?.toLowerCase() || 'production',
    });
  } catch (error) {
    console.error('Unable to retrieve categories:', error);
    res.status(500).send('Unable to load categories.');
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

export {
  showCategoriesPage,
  showCategoryDetailsPage,
};
