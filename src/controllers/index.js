const showHomePage = async (req, res) => {
  const title = 'Home';
  res.render('home', { title, NODE_ENV: process.env.NODE_ENV?.toLowerCase() || 'production' });
};

export { showHomePage };
