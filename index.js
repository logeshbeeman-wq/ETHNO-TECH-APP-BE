// Load environment variables first
require('dotenv').config();

// Import the main server configuration from src
const server = require('./src/server');

// Note: All server configuration, middleware, and routes
// are now handled in the src directory for better organization.
// See src/app.js and src/server.js for the main application logic.
