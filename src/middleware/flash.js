const defaultTypes = ['success', 'error', 'warning', 'info'];

const flash = (req, res, next) => {
  if (!req.session.flash) {
    req.session.flash = {};
  }

  req.flash = (type, message) => {
    if (type && message) {
      if (!req.session.flash[type]) {
        req.session.flash[type] = [];
      }

      req.session.flash[type].push(message);
      return req.session.flash[type];
    }

    if (type) {
      const messages = req.session.flash[type] || [];
      delete req.session.flash[type];
      return messages;
    }

    const messages = {};

    defaultTypes.forEach((messageType) => {
      messages[messageType] = req.session.flash[messageType] || [];
      delete req.session.flash[messageType];
    });

    return messages;
  };

  res.locals.flash = req.flash;
  next();
};

export default flash;