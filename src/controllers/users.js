import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { authenticateUser, createUser, getUserByEmail } from '../models/users.js';

const userValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Name must be 100 characters or fewer'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Email must be 100 characters or fewer'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const showUserRegistrationForm = async (req, res) => {
  const title = 'Register';

  res.render('register', {
    title,
    formData: {
      name: '',
      email: '',
    },
    errors: [],
  });
};

const processUserRegistrationForm = async (req, res, next) => {
  try {
    const results = validationResult(req);
    const formData = {
      name: (req.body.name || '').trim(),
      email: (req.body.email || '').trim().toLowerCase(),
    };

    if (!results.isEmpty()) {
      return res.render('register', {
        title: 'Register',
        formData,
        errors: results.array().map((error) => error.msg),
      });
    }

    const password = req.body.password || '';

    const duplicateUser = await getUserByEmail(formData.email);
    if (duplicateUser) {
      return res.render('register', {
        title: 'Register',
        formData,
        errors: ['An account with that email already exists'],
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await createUser(formData.name, formData.email, passwordHash);

    if (typeof req.flash === 'function') {
      req.flash('success', 'Account created successfully!');
    }

    res.redirect('/');
  } catch (error) {
    if (error?.code === '23505') {
      return res.render('register', {
        title: 'Register',
        formData: {
          name: (req.body.name || '').trim(),
          email: (req.body.email || '').trim().toLowerCase(),
        },
        errors: ['An account with that email already exists'],
      });
    }

    next(error);
  }
};

const showLoginForm = async (req, res) => {
  const title = 'Login';

  if (req.query.logout === '1') {
    req.flash('success', 'You have been logged out successfully.');
    return res.redirect('/login');
  }

  res.render('login', {
    title,
    formData: {
      email: '',
    },
    errors: [],
  });
};

const processLoginForm = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!email || !password) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const authenticatedUser = await authenticateUser(email, password);

    if (!authenticatedUser) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    req.session.user = authenticatedUser;

    if (typeof req.flash === 'function') {
      req.flash('success', 'Logged in successfully!');
    }

    console.log('Authenticated user:', authenticatedUser);

    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
};

const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash('error', 'You must log in to view that page.');
    return res.redirect('/login');
  }

  next();
};

const showDashboard = async (req, res, next) => {
  try {
    const { name, email } = req.session.user;

    res.render('dashboard', {
      title: 'Dashboard',
      name,
      email,
    });
  } catch (error) {
    next(error);
  }
};

const processLogout = async (req, res, next) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.clearCookie('connect.sid');
      return res.redirect('/login?logout=1');
    });
  } catch (error) {
    next(error);
  }
};

export {
  userValidation,
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  requireLogin,
  showDashboard,
  processLogout,
};