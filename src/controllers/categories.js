import { getAllCategories } from '../models/categories.js';

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

export { showCategoriesPage };
