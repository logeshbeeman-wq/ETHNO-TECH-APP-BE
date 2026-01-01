import { getDashboardData, fetchFilteredDashboardData } from '../../services/dashboardCache.js';
import TrainingService from '../../services/trainingService.js';
import { pool } from '../../db.js';

export const resolvers = {
  Query: {
    dashboardCards: async (_, { filter }) => {
      let conn;
      try {
        conn = await pool.getConnection();

        // Helper to build WHERE clause
        const buildWhere = (baseStatusClause) => {
          const conds = [];
          const p = [];

          // Base status check
          if (baseStatusClause) {
            conds.push(baseStatusClause);
          }

          // User filters
          if (filter) {
            if (filter.center) { conds.push("center = ?"); p.push(filter.center); }
            if (filter.technology) { conds.push("technology LIKE ?"); p.push(`%${filter.technology}%`); }
            if (filter.yearSem) { conds.push("year_sem = ?"); p.push(filter.yearSem); }
            if (filter.batch) { conds.push("batch = ?"); p.push(filter.batch); }
          }

          return {
            where: conds.length > 0 ? `WHERE ${conds.join(' AND ')}` : '',
            params: p
          };
        };

        const totalWhere = buildWhere("training_status IN ('Completed', 'Ongoing', 'Y', 'Yes')");
        const activeWhere = buildWhere("training_status IN ('Ongoing', 'In Progress', 'Y')");
        const coursesWhere = buildWhere("1=1"); // General filter for courses offered

        // -- Total Trainees
        const totalRows = await conn.query(`SELECT SUM(strength) as total FROM center_training ${totalWhere.where}`, totalWhere.params);
        const totalTraineesVal = Number(totalRows[0]?.total || 0);

        // -- Active Trainings
        const activeRows = await conn.query(`SELECT COUNT(*) as count FROM center_training ${activeWhere.where}`, activeWhere.params);
        const activeCount = Number(activeRows[0]?.count || 0);

        // -- Courses Offered
        const coursesRows = await conn.query(`SELECT COUNT(DISTINCT technology) as count FROM center_training ${coursesWhere.where}`, coursesWhere.params);
        const coursesCount = Number(coursesRows[0]?.count || 0);

        // -- Completion Rate
        const completionQuery = `
            SELECT 
                SUM(CASE WHEN training_status IN ('Completed', 'Yes') THEN 1 ELSE 0 END) as completed,
                COUNT(*) as total
            FROM center_training
            ${coursesWhere.where} 
        `;
        const completionRows = await conn.query(completionQuery, coursesWhere.params);

        const completed = Number(completionRows[0]?.completed || 0);
        const totalSessions = Number(completionRows[0]?.total || 1);
        const completionRate = totalSessions > 0 ? Math.round((completed / totalSessions) * 100) : 0;

        // Change stats (simplification: 0 for filtered views)
        const newTraineesChange = 0;
        const activeChange = 0;
        const coursesChange = 0;
        const completionChange = 0;

        return {
          totalTrainees: {
            id: 'total_trainees',
            title: 'Total Trainees',
            value: totalTraineesVal,
            change: newTraineesChange,
            changeType: 'increase'
          },
          activeTraining: {
            id: 'active_training',
            title: 'Active Training',
            value: activeCount,
            change: activeChange,
            changeType: 'increase'
          },
          coursesOffered: {
            id: 'courses_offered',
            title: 'Courses Offered',
            value: coursesCount,
            change: coursesChange,
            changeType: 'neutral'
          },
          completionRate: {
            id: 'completion_rate',
            title: 'Completion Rate',
            value: completionRate,
            change: completionChange,
            changeType: 'neutral',
            isPercentage: true
          },
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error in dashboardCards resolver:', error);
        throw new Error('Failed to fetch dashboard cards data');
      } finally {
        if (conn) conn.release();
      }
    },
    dashboardStats: async (_, { filter }) => {
      try {
        // If filters are provided, fetch directly from DB
        if (filter && Object.keys(filter).length > 0) {
          return await fetchFilteredDashboardData(filter);
        }

        // If no filter, we can use the cache or fetch fresh.
        // User asked for real-time from table, so we use the fetching function directly.
        return await fetchFilteredDashboardData({});
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