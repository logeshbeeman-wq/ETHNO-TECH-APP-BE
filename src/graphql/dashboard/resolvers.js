import { getDashboardData } from '../../services/dashboardCache.js';
import TrainingService from '../../services/trainingService.js';
import { pool } from '../../db.js';

export const resolvers = {
  Query: {
    dashboardCards: async () => {
      try {
        // This is mock data - in a real app, you would fetch this from your database
        // and calculate the changes based on previous period data
        return {
          totalTrainees: {
            id: 'total_trainees',
            title: 'Total Trainees',
            value: 1234,
            change: 12,
            changeType: 'increase'
          },
          activeTraining: {
            id: 'active_training',
            title: 'Active Training',
            value: 24,
            change: 2,
            changeType: 'increase'
          },
          coursesOffered: {
            id: 'courses_offered',
            title: 'Courses Offered',
            value: 18,
            change: 5,
            changeType: 'increase'
          },
          completionRate: {
            id: 'completion_rate',
            title: 'Completion Rate',
            value: 94,
            change: 3,
            changeType: 'increase',
            isPercentage: true
          },
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error in dashboardCards resolver:', error);
        throw new Error('Failed to fetch dashboard cards data');
      }
    },
    dashboardStats: async () => {
      try {
        const data = getDashboardData();
        return data;
      } catch (error) {
        console.error('Error in dashboardStats resolver:', error);
        throw new Error('Failed to fetch dashboard data');
      }
    },
    employeeStats: async (_, { employeeId, startDate, endDate }) => {
      try {
        const trainingService = new TrainingService(pool);
        return await trainingService.getEmployeeStats(employeeId, startDate, endDate);
      } catch (error) {
        console.error('Error in employeeStats resolver:', error);
        throw new Error('Failed to fetch employee stats');
      }
    },
  },
};

export default resolvers;