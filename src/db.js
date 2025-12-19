import mariadb from 'mariadb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Create a connection pool
const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ETHNO_DB',
  connectionLimit: 10,
  multipleStatements: true
});

// Test the database connection
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('SELECT 1');
    console.log('✅ Successfully connected to the database');
    return true;
  } catch (err) {
    console.error('❌ Error connecting to the database:', err.message);
    return false;
  } finally {
    if (conn) await conn.release();
  }
}

// Initialize database with required tables
const initializeDatabase = async () => {
  try {
    // Drop the users table if it exists
    await pool.query('DROP TABLE IF EXISTS users');
    
    // Recreate the users table with the correct schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin', 'superadmin') NOT NULL DEFAULT 'user',
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Check if superadmin exists
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      ['superadmin', 'admin@example.com']
    );

    // If no superadmin exists, create one
    if (!rows || rows.length === 0) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['superadmin', 'admin@example.com', hashedPassword, 'superadmin']
      );
      console.log('✅ Default superadmin user created');
      console.log('   Username: superadmin');
      // console.log('   Password: Admin@123');
    }

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
    throw err;
  }
};

// Function to execute queries
async function query(sql, params = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } catch (err) {
    console.error('❌ Database query error:', err.message);
    console.error('Query:', sql);
    console.error('Parameters:', params);
    throw err;
  } finally {
    if (conn) await conn.release();
  }
}

// Initialize the database when this module is imported
initializeDatabase().catch(err => {
  console.error('❌ Failed to initialize database:', err);
  process.exit(1);
});

// Export the connection pool and utility functions
export { pool, testConnection, initializeDatabase, query };

export default {
  pool,
  testConnection,
  initializeDatabase,
  query
};
