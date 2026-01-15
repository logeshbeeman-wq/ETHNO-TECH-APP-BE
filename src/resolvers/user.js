// src/resolvers/user.js
export const userResolvers = {
  Query: {
    // Get user by ID (Aliased to getUser as well)
    user: async (_, { id }, { user: currentUser, models }) => {
      try {
        console.log('=== Fetching user ===');
        if (!currentUser) {
          throw new Error('Authentication required');
        }

        const user = await models.User.findById(id);

        if (!user) {
          throw new Error('User not found');
        }

        // Users can view their own profile, admins or superadmins can view any profile
        if (currentUser.id.toString() !== id.toString() &&
          currentUser.role !== 'admin' &&
          currentUser.role !== 'superadmin') {
          throw new Error('Not authorized to view this user');
        }

        return user;
      } catch (error) {
        console.error('Error in user resolver:', error.message);
        throw error;
      }
    },
    getUser: (...args) => userResolvers.Query.user(...args),

    allUsers: async (_, __, { user: currentUser, models }) => {
      try {
        console.log('=== allUsers resolver ===');
        console.log('Current user:', JSON.stringify(currentUser, null, 2));

        // Uncomment these lines when authentication is working
        // if (!currentUser) {
        //   throw new Error('Authentication required');
        // }
        // if (currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
        //   throw new Error('Admin access required');
        // }
        console.log('Fetching all users...');
        const users = await models.User.getAllUsers();
        console.log(`Returning ${users.length} users`);

        return users;
      } catch (error) {
        console.error('Error in allUsers resolver:', {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
        // Return empty array on error
        return [];
      }
    },

    // Get all non-superadmin users
    regularUsers: async (_, __, { user: currentUser, models }) => {
      try {
        console.log('=== regularUsers resolver ===');

        if (!currentUser) {
          throw new Error('Authentication required');
        }
        // Only allow superadmin to view regular users
        if (currentUser.role !== 'superadmin') {
          throw new Error('Admin access required');
        }
        console.log('Fetching non-superadmin users...');
        const users = await models.User.getAllExceptSuperadmin();

        // Ensure we return an array, even if empty
        const result = Array.isArray(users) ? users : (users ? [users] : []);
        console.log(`Returning ${result.length} users`);

        return result;
      } catch (error) {
        console.error('Error in regularUsers resolver:', {
          message: error.message,
          stack: error.stack
        });
        throw error;
      }
    }
  },

  // In user.js resolvers
  Mutation: {
    updateUser: async (_, { input }, { user: currentUser, models }) => {
      try {
        console.log('=== updateUser ===');
        console.log('Current user:', JSON.stringify(currentUser, null, 2));
        console.log('Input:', input);

        if (!currentUser) {
          throw new Error('Authentication required');
        }

        const { id, ...updates } = input;

        // Regular users can only update their own profile
        if (currentUser.id !== id && currentUser.role !== 'superadmin') {
          throw new Error('Not authorized to update this user');
        }

        // Only superadmin can change roles
        if (updates.role && currentUser.role !== 'superadmin') {
          throw new Error('Not authorized to change user roles');
        }

        const updatedUser = await models.User.update(id, updates);
        return updatedUser;
      } catch (error) {
        console.error('Error in updateUser resolver:', {
          message: error.message,
          stack: error.stack
        });
        throw error;
      }
    },

    deleteUser: async (_, { id }, { user: currentUser, models }) => {
      try {
        console.log('=== deleteUser ===');
        if (!currentUser) throw new Error('Authentication required');
        if (currentUser.role !== 'superadmin') throw new Error('Not authorized');

        const result = await models.User.delete(id);
        return true;
      } catch (error) {
        console.error('Error in deleteUser resolver:', error);
        throw error;
      }
    }
  }
};