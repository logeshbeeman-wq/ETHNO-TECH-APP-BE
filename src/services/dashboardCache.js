import cron from 'node-cron';
import { pool } from '../db.js';

// Cache object to store dashboard data
let dashboardCache = {
  data: null,
  lastUpdated: null,
  isUpdating: false
};

/**
 * Fetches fresh dashboard data from the database
 */
/**
 * Fetches fresh dashboard data from the database with optional filters
 */
async function fetchFilteredDashboardData(filter = {}) {
  const conn = await pool.getConnection();
  try {
    const conditions = [];
    const params = [];

    // Always include the status check
    conditions.push("training_status IN ('Completed', 'Ongoing', 'In Progress', 'Y', 'Yes')");

    if (filter.center) {
      conditions.push("center = ?");
      params.push(filter.center);
    }
    if (filter.technology) {
      conditions.push("technology LIKE ?");
      params.push(`%${filter.technology}%`);
    }
    if (filter.yearSem) {
      conditions.push("year_sem = ?");
      params.push(filter.yearSem);
    }
    if (filter.batch) {
      conditions.push("batch = ?");
      params.push(filter.batch);
    }
    // Add other filters as needed

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get counts for each trainee type from center_training table
    const centerTrainingRows = await conn.query(`
      SELECT 
        SUM(CASE WHEN trainer_type = 'Internal' THEN 1 ELSE 0 END) as permanent_count,
        SUM(CASE WHEN trainer_type = 'Internal-Contract' THEN 1 ELSE 0 END) as contract_count,
        SUM(strength) as total_students_trained,
        SUM(CASE WHEN examination_status = 'Completed' THEN strength ELSE 0 END) as total_certified_students,
        COUNT(DISTINCT employee_id) as total_trainers,
        COUNT(*) as total_trainees
      FROM center_training
      ${whereClause}
    `, params);

    const centerTrainingCounts = centerTrainingRows[0] || {};

    // Use counts from center_training table
    const counts = {
      permanent_count: Number(centerTrainingCounts.permanent_count || 0),
      contract_count: Number(centerTrainingCounts.contract_count || 0),
      student_count: Number(centerTrainingCounts.total_students_trained || 0),
      certificate_count: Number(centerTrainingCounts.total_certified_students || 0),
      trainers_count: Number(centerTrainingCounts.total_trainers || 0),
      total_trainees: Number(centerTrainingCounts.total_trainees || 0)
    };

    // Employee Training Status List
    // We reuse the user filters but maybe NOT the hardcoded status check if it filters out too much?
    // Original query: SELECT form center_training ORDER BY name LIMIT 100
    // Let's add the USER specified filters.

    const listConditions = [];
    const listParams = [];

    if (filter.center) { listConditions.push("center = ?"); listParams.push(filter.center); }
    if (filter.technology) { listConditions.push("technology LIKE ?"); listParams.push(`%${filter.technology}%`); }
    if (filter.yearSem) { listConditions.push("year_sem = ?"); listParams.push(filter.yearSem); }
    if (filter.batch) { listConditions.push("batch = ?"); listParams.push(filter.batch); }

    const listWhere = listConditions.length > 0 ? `WHERE ${listConditions.join(' AND ')}` : '';

    const centerTraining = await conn.query(`
      SELECT 
        trainer_name as name,
        trainer_type as type,
        training_status as status,
        certification as certificate,
        center as department
      FROM center_training
      ${listWhere}
      ORDER BY name
      LIMIT 100
    `, listParams);

    const employeeTrainingStatus = Array.isArray(centerTraining) ? centerTraining : [];

    // Calculate percentages
    const totalSessions = counts.total_trainees || 1;
    const totalStudents = counts.student_count || 1;

    // Individual percentages
    const permPct = Math.round(((counts.permanent_count || 0) / totalSessions) * 1000) / 10;
    const contractPct = Math.round(((counts.contract_count || 0) / totalSessions) * 1000) / 10;

    // Students Trained - currently treated as the base population (100% or just display count)
    // If we want to show % of growth or something we'd need history.
    // For now, let's just use 100% or keep it consistent with UI expectations.
    const studentPct = 100;

    // Certified Students % relative to Total Students Trained
    const certificatePct = Math.round(((counts.certificate_count || 0) / totalStudents) * 1000) / 10;

    // Average percentage of all metrics
    const avgPercentage = Math.round(((permPct + contractPct + studentPct + certificatePct) / 4) * 10) / 10;

    return {
      keyMetrics: {
        permanentTrainees: {
          count: counts.permanent_count || 0,
          percentage: permPct
        },
        internalContractTrainees: {
          count: counts.contract_count || 0,
          percentage: contractPct
        },
        studentsTrained: {
          count: counts.student_count || 0,
          percentage: studentPct
        },
        certificateStudents: {
          count: counts.certificate_count || 0,
          percentage: certificatePct
        },
        trainers: {
          count: counts.trainers_count || 0,
          percentage: 0
        },
        avgPercentage: avgPercentage
      },
      traineeDistribution: {
        permanent: counts.permanent_count || 0,
        internalContract: counts.contract_count || 0,
        student: counts.student_count || 0,
        certificate: counts.certificate_count || 0,
        trainers: counts.trainers_count || 0
      },
      pieChartData: [
        { name: 'Permanent', value: counts.permanent_count || 0 },
        { name: 'Internal-Contract', value: counts.contract_count || 0 },
        { name: 'Student', value: counts.student_count || 0 },
        { name: 'Certificate', value: counts.certificate_count || 0 }
      ],
      employeeTrainingStatus: employeeTrainingStatus || [],
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  } finally {
    if (conn) await conn.release();
  }
}

/**
 * Updates the dashboard cache
 */
async function updateDashboardCache() {
  if (dashboardCache.isUpdating) return;

  try {
    dashboardCache.isUpdating = true;
    const data = await fetchFilteredDashboardData({}); // Fetch without filters for cache
    dashboardCache.data = data;
    dashboardCache.lastUpdated = new Date().toISOString();
  } catch (error) {
    console.error('Failed to update dashboard cache:', error);
  } finally {
    dashboardCache.isUpdating = false;
  }
}

/**
 * Initializes the dashboard cache and starts the update scheduler
 */
function initDashboardCache() {
  // Initial data load
  updateDashboardCache().catch(console.error);

  // Schedule updates every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    updateDashboardCache().catch(console.error);
  });
}

/**
 * Gets the cached dashboard data
 */
function getDashboardData() {
  return {
    ...dashboardCache.data,
    lastUpdated: dashboardCache.lastUpdated,
    isStale: !dashboardCache.lastUpdated ||
      (Date.now() - new Date(dashboardCache.lastUpdated).getTime() > 6 * 60 * 1000)
  };
}

export { initDashboardCache, getDashboardData, updateDashboardCache, fetchFilteredDashboardData };
