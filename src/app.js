// src/app.js
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'express-session';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pool } from './db.js';
import User from './models/User.js';
import Employee from './models/Employee.js';
import CenterTraining from './models/CenterTraining.js';
import schema from './graphql/schema.js';
import { verifyToken, generateToken } from './utils/auth.js';
import { configurePassport } from './config/oauth.js';
import { getDashboardData, initDashboardCache } from './services/dashboardCache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function createApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Initialize Passport
  const passport = configurePassport(pool);
  app.use(passport.initialize());
  app.use(passport.session());

  // Create logs directory if it doesn't exist
  const logsDir = join(__dirname, '..', 'logs');
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }

  // Set up request logging
  const accessLogStream = createWriteStream(
    join(logsDir, 'access.log'),
    { flags: 'a' }
  );

  // HTTP request logging (to file only)
  app.use(morgan('combined', {
    stream: accessLogStream,
    skip: (req) => req.path === '/health' // Skip health check logs
  }));

  // Only log UI requests (not health checks or other automated requests)
  app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const isBrowserRequest = userAgent.includes('Mozilla') ||
      userAgent.includes('Chrome') ||
      userAgent.includes('Safari') ||
      userAgent.includes('PostmanRuntime');

    if (isBrowserRequest && !req.path.startsWith('/health')) {
      // console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${userAgent.split(' ')[0]}`);
    }
    next();
  });

  // Initialize models
  const userModel = new User(pool);

  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Token verification endpoint
  app.get('/auth/verify', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        valid: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify the token using your existing verifyToken function
      const decoded = verifyToken(token);
      const user = await new User(pool).findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          valid: false,
          error: 'User not found'
        });
      }

      // Return user data (exclude sensitive info)
      const { password, ...userData } = user;
      return res.json({
        valid: true,
        user: userData
      });
    } catch (error) {
      return res.status(401).json({
        valid: false,
        error: 'Invalid or expired token'
      });
    }
  });

  // Apply middleware
  app.use(
    '/graphql',
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }),
    bodyParser.json(),
    // Log GraphQL operations with timing
    (req, res, next) => {
      // Helper to recursively strip metadata fields from objects
      const stripMetadata = (obj) => {
        if (Array.isArray(obj)) {
          return obj.map(stripMetadata);
        } else if (obj !== null && typeof obj === 'object') {
          const newObj = {};
          const fieldsToStrip = ['__typename', 'createdAt', 'updatedAt'];
          for (const key in obj) {
            if (!fieldsToStrip.includes(key)) {
              newObj[key] = stripMetadata(obj[key]);
            }
          }
          return newObj;
        }
        return obj;
      };

      // Strip metadata from variables if they exist
      if (req.body && req.body.variables) {
        req.body.variables = stripMetadata(req.body.variables);
      }

      const userAgent = req.headers['user-agent'] || '';
      const isBrowserRequest = userAgent.includes('Mozilla') ||
        userAgent.includes('Chrome') ||
        userAgent.includes('Safari') ||
        userAgent.includes('PostmanRuntime');

      if (!isBrowserRequest) return next();

      const start = Date.now();
      const originalSend = res.send;

      res.send = function (body) {
        const operation = req.body?.operationName || 'Anonymous Operation';
        return originalSend.call(this, body);
      };

      next();
    },
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        console.log('Auth header:', authHeader);

        let token = null;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
        let user = null;
        if (token) {
          try {
            console.log('Verifying token:', token);
            const decoded = verifyToken(token);
            console.log('Decoded token:', decoded);

            // Extract user ID from the token
            const userId = decoded.userId?.userId || decoded.userId;
            if (userId) {
              user = await new User(pool).findById(userId);
            }
          } catch (error) {
            console.error('Token verification failed:', error);
          }
        }

        return {
          user,
          models: {
            User: new User(pool),
            Employee: new Employee(pool),
            CenterTraining: new CenterTraining(pool)
          }
        };
      }

    })
  );

  // OAuth Routes
  app.get('/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth/failure',
      session: false,
      failureMessage: true
    }),
    (req, res) => {
      const userData = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name
      };

      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${req.user.token}&user=${encodeURIComponent(JSON.stringify(userData))}`;

      res.redirect(redirectUrl);
    }
  );

  // OAuth failure route
  app.get('/auth/failure', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=not_registered`);
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  // Add this to your app.js temporarily
  app.get('/test-db', async (req, res) => {
    try {
      // 1. Test connection
      const conn = await pool.getConnection();

      // 2. Get database info
      const [dbInfo] = await conn.query('SELECT DATABASE() as db, USER() as user, VERSION() as version');

      // 3. Check tables
      const [tables] = await conn.query(`
      SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH, INDEX_LENGTH, TABLE_COLLATION 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [dbInfo.db]);

      // 4. Get users data
      let users = [];
      if (tables.some(t => t.TABLE_NAME === 'users')) {
        [users] = await conn.query('SELECT * FROM users');
      }

      // 5. Release connection
      conn.release();

      // 6. Send response
      res.json({
        success: true,
        database: {
          name: dbInfo.db,
          user: dbInfo.user,
          version: dbInfo.version
        },
        // tables: tables.map(t => ({
        //   name: t.TABLE_NAME,
        //   rows: t.TABLE_ROWS,
        //   size: `${((t.DATA_LENGTH + t.INDEX_LENGTH) / 1024 / 1024).toFixed(2)} MB`,
        //   collation: t.TABLE_COLLATION
        // })),
        users: {
          count: users.length,
          data: users
        }
      });

    } catch (error) {
      console.error('Test endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Dashboard API endpoint
  app.get('/api/dashboard/stats', (req, res) => {
    try {
      const data = getDashboardData();
      res.json(data);
    } catch (error) {
      console.error('Error fetching dashboard stats from REST API:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  // Initialize dashboard cache
  initDashboardCache();

  return { server, app, httpServer };
}