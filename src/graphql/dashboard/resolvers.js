// In src/graphql/dashboard/resolvers.js
import { getDashboardData } from '../../services/dashboardCache.js';  // Added .js extension

export const resolvers = {
  Query: {
    dashboardStats: async () => {
      try {
        const data = getDashboardData();
        return data;
      } catch (error) {
        console.error('Error in dashboardStats resolver:', error);
        throw new Error('Failed to fetch dashboard data');
      }
    },
  },
};

export default resolvers;