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
import schema from './graphql/schema.js';
import { verifyToken, generateToken } from './utils/auth.js';
import { configurePassport } from './config/oauth.js';

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
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${userAgent.split(' ')[0]}`);
    }
    next();
  });

  // Initialize models
  const userModel = new User(pool);

  const server = new ApolloServer({
    schema,
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
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${operation}`);
        console.log(`Response time: ${Date.now() - start}ms`);
        console.log('---');
        return originalSend.call(this, body);
      };
      
      next();
    },
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        let user = null;
        
        if (token) {
          try {
            const decoded = verifyToken(token.replace('Bearer ', ''));
            user = await new User(pool).findById(decoded.userId);
          } catch (error) {
            console.error('Error verifying token:', error.message);
          }
        }

        return {
          user,
          db: {
            user: new User(pool)
          }
        };
      },
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

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  return { server, app, httpServer };
}