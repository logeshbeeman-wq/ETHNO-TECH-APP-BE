const mariadb = require('mariadb');
const migrator = require('./migrator');
require('dotenv').config();

// Create a connection pool
const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ethno_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  connectionLimit: 10,
  multipleStatements: true
});

// Test the connection and run migrations
async function initializeDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Successfully connected to the database');
    
    // Run migrations
    await migrator.init();
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

// Initialize the database when this module is loaded
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

module.exports = {
  pool,
  initializeDatabase
};
