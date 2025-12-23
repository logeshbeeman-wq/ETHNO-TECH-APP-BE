// src/models/User.js
import bcrypt from 'bcryptjs';

class User {
  constructor(connection) {
    console.log('Database connection in resolver:', connection, {
      isConnected: !!connection,
      database: connection?.config
    });
    this.connection = connection;
  }


  // Create a new user
  async create({ username, email, password, phoneNumber, role = 'user', status = 'active' }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await this.connection.query(
        'INSERT INTO users (username, email, password, phone_number, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, hashedPassword, phoneNumber, role, status]
      );
      // Get the inserted ID from the result
      const insertId = result.insertId || (result[0] && result[0].insertId);
      if (!insertId) {
        throw new Error('Failed to get insert ID');
      }
      return this.findById(insertId);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const result = await this.connection.query(
        'SELECT id, username, email, phone_number as phoneNumber, role, status, created_at as createdAt FROM users WHERE id = ?',
        [id]
      );
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Failed to find user');
    }
  }

  // Find user by email
  async findByEmail(email) {
    try {
      const result = await this.connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      // Check if we got any rows back
      if (Array.isArray(result) && result.length > 0) {
        return result[0]; // Return the first user found
      }
      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user by email');
    }
  }

  // Find user by username
  async findByUsername(username) {
    try {
      const result = await this.connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      // Check if we got any rows back
      if (Array.isArray(result) && result.length > 0) {
        return result[0]; // Return the first user found
      }
      return null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw new Error('Failed to find user by username');
    }
  }

  // Compare password
  async comparePassword(candidatePassword, hashedPassword) {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error('Failed to compare passwords');
    }
  }

  // Get all users
  async getAll() {
    try {
      const result = await this.connection.query(
        'SELECT id, username, email, role, status, created_at as createdAt FROM users'
      );
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get users');
    }
  }

  // In src/models/User.js
  // In src/models/User.js
  async getAllUsers() {
    try {
      console.log('=== getAllUsers START ===');
      console.log('Database connection:', this.connection ? 'Connected' : 'Not connected');

      // First, check if the table exists
      try {
        const [tables] = await this.connection.query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users'
      `);
        console.log('Tables check:', tables);
      } catch (tableError) {
        console.error('Error checking tables:', tableError.message);
      }

      // Try a simple count query first
      try {
        const [count] = await this.connection.query('SELECT COUNT(*) as count FROM users');
        console.log('User count:', count);
      } catch (countError) {
        console.error('Error counting users:', countError.message);
      }

      // Now try the actual query
      console.log('Executing query: SELECT * FROM users');
      // MariaDB returns results directly as an array
      const rows = await this.connection.query('SELECT * FROM users');

      console.log('Query result:', {
        rowsCount: rows ? rows.length : 0
      });

      if (rows && rows.length > 0) {
        console.log(`Found ${rows.length} users`);
        console.log('First user sample:', JSON.stringify(rows[0], null, 2));
      } else {
        console.log('No users found in the database');
      }

      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error('Error in getAllUsers:', {
        message: error.message,
        sql: error.sql,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
        stack: error.stack
      });
      return [];
    } finally {
      console.log('=== getAllUsers END ===');
    }
  }

  async getAllExceptSuperadmin() {
    try {
      console.log('=== Starting getAllExceptSuperadmin ===');
      console.log('Connection details:', {
        database: this.connection,
        user: this.connection
      });

      // First, check if the table exists
      const tables = await this.connection.query(
        "SHOW TABLES LIKE 'users'"
      );
      console.log('Tables check:', tables.length > 0 ? 'Users table exists' : 'Users table does NOT exist');

      // Get all users for debugging
      const allUsers = await this.connection.query('SELECT * FROM users');
      console.log('All users in database:', allUsers);

      // Then get non-superadmin users
      // MariaDB returns results directly as an array, no destructuring needed
      const rows = await this.connection.query(
        'SELECT * FROM users WHERE role != ?',
        ['superadmin']
      );

      console.log('Non-superadmin users found:', rows);
      return rows;
    } catch (error) {
      console.error('Error in getAllExceptSuperadmin:', {
        message: error.message,
        sql: error.sql,
        code: error.code,
        stack: error.stack
      });
      return []; // Return empty array on error
    }
  }
  // Update user
  async update(id, fields) {
    try {
      const validFields = {};
      const validKeys = ['username', 'email', 'password', 'role', 'phoneNumber', 'status'];

      // Filter only valid fields that are not undefined
      Object.keys(fields).forEach(key => {
        if (validKeys.includes(key) && fields[key] !== undefined) {
          validFields[key] = fields[key];
        }
      });

      if (Object.keys(validFields).length === 0) {
        throw new Error('No valid fields provided for update');
      }

      const setClause = Object.keys(validFields)
        .map(key => `${key} = ?`)
        .join(', ');

      const values = [...Object.values(validFields), id];

      const result = await this.connection.query(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        values
      );

      return this.findById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  // Delete user
  async delete(id) {
    try {
      const result = await this.connection.query(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
}

export default User;