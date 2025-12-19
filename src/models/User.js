// src/models/User.js
import bcrypt from 'bcryptjs';

class User {
  constructor(connection) {
    this.connection = connection;
  }

  // Create a new user
  async create({ username, email, password, role = 'user' }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await this.connection.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role]
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
        'SELECT id, username, email, role, created_at as createdAt FROM users WHERE id = ?',
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
        'SELECT id, username, email, role, created_at as createdAt FROM users'
      );
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get users');
    }
  }
}

export default User;