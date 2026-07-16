import { getAllProjects } from '../models/projects.js';

const showProjectsPage = async (req, res) => {
  try {
    const title = 'Service Projects';
    const projects = await getAllProjects();

    res.render('projects', { title, projects, NODE_ENV: process.env.NODE_ENV?.toLowerCase() || 'production' });
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).send('Unable to load projects at this time.');
  }
};

export { showProjectsPage };
