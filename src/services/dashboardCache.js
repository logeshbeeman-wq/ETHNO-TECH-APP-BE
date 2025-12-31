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
async function fetchDashboardData() {
  const conn = await pool.getConnection();
  try {
    // Get counts for each trainee type from center_training table
    // Expand training_status filter to include common values like 'Y', 'Yes', 'Completed', 'Ongoing'
    const centerTrainingRows = await conn.query(`
      SELECT 
        SUM(CASE WHEN trainer_type = 'Permanent' THEN 1 ELSE 0 END) as permanent_count,
        SUM(CASE WHEN trainer_type = 'Contract' OR trainer_type = 'Internal-Contract' THEN 1 ELSE 0 END) as contract_count,
        SUM(CASE WHEN trainer_type = 'Student' THEN 1 ELSE 0 END) as student_count,
        SUM(CASE WHEN certification = 'Yes' THEN 1 ELSE 0 END) as certificate_count,
        COUNT(*) as total_trainees
      FROM center_training
      WHERE training_status IN ('Completed', 'Ongoing', 'Y', 'Yes')
    `);

    const centerTrainingCounts = centerTrainingRows[0] || {};

    // Use counts from center_training table (convert BigInt to Number as mariadb returns BigInt for SUM/COUNT)
    const counts = {
      permanent_count: Number(centerTrainingCounts.permanent_count || 0),
      contract_count: Number(centerTrainingCounts.contract_count || 0),
      student_count: Number(centerTrainingCounts.student_count || 0),
      certificate_count: Number(centerTrainingCounts.certificate_count || 0),
      total_trainees: Number(centerTrainingCounts.total_trainees || 0)
    };

    // Get employee training status from center_training
    const centerTraining = await conn.query(`
      SELECT 
        trainer_name as name,
        trainer_type as type,
        training_status as status,
        certification as certificate,
        center as department
      FROM center_training
      ORDER BY name
      LIMIT 100
    `);

    const employeeTrainingStatus = Array.isArray(centerTraining) ? centerTraining : [];

    // Calculate percentages
    const total = counts.total_trainees || 1;

    // Individual percentages
    const permPct = Math.round(((counts.permanent_count || 0) / total) * 1000) / 10;
    const contractPct = Math.round(((counts.contract_count || 0) / total) * 1000) / 10;
    const studentPct = Math.round(((counts.student_count || 0) / total) * 1000) / 10;
    const certificatePct = Math.round(((counts.certificate_count || 0) / total) * 1000) / 10;

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
        avgPercentage: avgPercentage
      },
      traineeDistribution: {
        permanent: counts.permanent_count || 0,
        internalContract: counts.contract_count || 0,
        student: counts.student_count || 0,
        certificate: counts.certificate_count || 0
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
    const data = await fetchDashboardData();
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

export { initDashboardCache, getDashboardData, updateDashboardCache };
