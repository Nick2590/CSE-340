
import fs from 'fs';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

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

const { testConnection } = await import('./src/models/dg.js');
const { getAllOrganizations } = await import('./src/models/organizations.js');

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = Number(process.env.PORT) || 3000;

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';

        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Error loading organizations:', error);
        res.status(500).send('Unable to load organizations at this time.');
    }
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

app.get('/categories', (req, res) => {
  res.render('categories', {
    title: 'Service Project Categories'
  });
});

const startServer = async (port) => {
  try {
    await testConnection();
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
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

startServer(PORT);
