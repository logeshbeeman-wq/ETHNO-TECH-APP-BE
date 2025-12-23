// src/resolvers/auth.js
import { generateToken } from '../utils/auth.js';

export const authResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    users: async (_, __, { user, db }) => {
      if (!user || user.role !== 'superadmin') {
        throw new Error('Not authorized');
      }
      return db.user.getAll();
    }
  },
  Mutation: {
    register: async (_, { input }, { user: currentUser, db }) => {
      try {
        const { username, email, password, phoneNumber, role = 'user' } = input;
        
        // Only allow admins to create users with roles other than 'user'
        if (role !== 'user' && (!currentUser || currentUser.role !== 'admin')) {
          throw new Error('Not authorized to create users with this role');
        }
        
        // Check if user already exists
        const existingUser = await db.user.findByEmail(email) || await db.user.findByUsername(username);
        if (existingUser) {
          throw new Error('User with this email or username already exists');
        }

        // Validate required fields
        if (!phoneNumber) {
          throw new Error('Phone number is required');
        }

        // Create new user with the specified role
        const newUser = await db.user.create({ 
          username, 
          email, 
          password, 
          phoneNumber, 
          role: role || 'user' // Default to 'user' if no role is specified
        });
        const token = generateToken({ userId: newUser.id, role: newUser.role });
        
        return {
          token,
          user: newUser
        };
      } catch (error) {
        console.error('Registration error:', error);
        throw new Error(error.message || 'Failed to register user');
      }
    },
    login: async (_, { input }, { db }) => {
  try {
    const { email, password } = input;
    
    // Input validation
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Debug log
    console.log('Login attempt for email:', email);
    
    // Check if user exists
    const user = await db.user.findByEmail(email);
    
    if (!user) {
      // Generic error message for security (don't reveal if email exists)
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (user.status === 'inactive') {
      console.log('Login attempt for inactive account:', user.id);
      throw new Error('This account has been deactivated. Please contact support.');
    }

    // Verify password
    const isValid = await db.user.comparePassword(password, user.password);
    if (!isValid) {
      // Generic error message for security
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({ 
      userId: user.id, 
      role: user.role 
    });
    
    // Return user data (excluding sensitive information)
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        name: user.name || null,
        profileImage: user.profile_image || null
      }
    };
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      email: input.email,
      timestamp: new Date().toISOString()
    });
    
    // Handle specific database errors
    if (error.message.includes('ECONNREFUSED') || 
        error.message.includes('ETIMEDOUT') ||
        error.message.includes('Connection')) {
      throw new Error('Unable to connect to the server. Please try again later.');
    }
    
    // Re-throw the error with its message
    throw error;
  }
}
  }
};

export default authResolvers;