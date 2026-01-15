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
    return this.getAllUsers();
  }

  // In src/models/User.js
  // In src/models/User.js
  async getAllUsers() {
    try {
      console.log('=== getAllUsers START ===');

      const query = `
        SELECT 
          id, 
          username, 
          email, 
          phone_number as phoneNumber, 
          role, 
          status, 
          created_at as createdAt 
        FROM users
      `;

      const rows = await this.connection.query(query);

      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  }

  async getAllExceptSuperadmin() {
    try {
      console.log('=== Starting getAllExceptSuperadmin ===');

      const query = `
        SELECT 
          id, 
          username, 
          email, 
          phone_number as phoneNumber, 
          role, 
          status, 
          created_at as createdAt 
        FROM users 
        WHERE role != ?
      `;

      const rows = await this.connection.query(query, ['superadmin']);

      console.log('Non-superadmin users found:', rows);
      return rows;
    } catch (error) {
      console.error('Error in getAllExceptSuperadmin:', error);
      return [];
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

      const fieldMapping = {
        username: 'username',
        email: 'email',
        password: 'password',
        role: 'role',
        phoneNumber: 'phone_number',
        status: 'status'
      };

      const setClause = Object.keys(validFields)
        .map(key => `${fieldMapping[key]} = ?`)
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