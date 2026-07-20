
import fs from 'fs';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import flash from './src/middleware/flash.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEnvFile = () => {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;

  const envFile = fs.readFileSync(envPath, 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const [key, ...rest] = trimmed.split('=');
    if (!key) continue;

    const rawValue = rest.join('=');
    const value = rawValue.trim().replace(/^"(.*)"$/, '$1').replace(/^\'(.*)\'$/, '$1');

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

loadEnvFile();

const SESSION_SECRET = process.env.SESSION_SECRET;

const { initializeDatabase, testConnection } = await import('./src/models/dg.js');
const { default: router } = await import('./src/routes.js');

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = Number(process.env.PORT) || 3000;

const createApp = () => {
  const app = express();

  app.locals.NODE_ENV = NODE_ENV;
  app.use(express.static(path.join(__dirname, 'public')));

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'src/views'));

  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  }));

  app.use(flash);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Middleware to log all incoming requests
  app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
      console.log(`${req.method} ${req.url}`);
    }
    next();
  });

  // Middleware to make NODE_ENV available to all templates
  app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
  });

  app.use(router);

  // Catch-all route for 404 errors
  app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    const context = {
      title: status === 404 ? 'Page Not Found' : 'Server Error',
      error: err.message,
      stack: err.stack,
      NODE_ENV,
    };

    res.status(status).render(`errors/${template}`, context);
  });

  return app;
};

const app = createApp();

const startServer = async (port = PORT) => {
  try {
    await testConnection();
    await initializeDatabase();
  } catch (error) {
    console.warn('Database unavailable; continuing without database initialization:', error.message);
  }

  const server = app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
    console.log(`Environment: ${NODE_ENV}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });

  return server;
};

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  startServer(PORT);
}

export { app, createApp, startServer };