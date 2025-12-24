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
    // Get counts for each trainee type from both tables
    const [centerTrainingCounts] = await conn.query(`
      SELECT 
        SUM(CASE WHEN trainer_type = 'Permanent' THEN 1 ELSE 0 END) as permanent_count,
        SUM(CASE WHEN trainer_type = 'Contract' THEN 1 ELSE 0 END) as contract_count,
        SUM(CASE WHEN trainer_type = 'Student' THEN 1 ELSE 0 END) as student_count,
        SUM(CASE WHEN certification = 'Yes' THEN 1 ELSE 0 END) as certificate_count,
        COUNT(*) as total_trainees
      FROM center_training
      WHERE training_status = 'Completed' OR training_status = 'Ongoing'
    `) || [{}];

    const [batchTrainingCounts] = await conn.query(`
      SELECT 
        SUM(CASE WHEN trainer_type = 'Permanent' THEN 1 ELSE 0 END) as permanent_count,
        SUM(CASE WHEN trainer_type = 'Contract' THEN 1 ELSE 0 END) as contract_count,
        SUM(CASE WHEN trainer_type = 'Student' THEN 1 ELSE 0 END) as student_count,
        SUM(CASE WHEN certification = 'Yes' THEN 1 ELSE 0 END) as certificate_count,
        COUNT(*) as total_trainees
      FROM batch_training
      WHERE training_status = 'Completed' OR training_status = 'Ongoing'
    `) || [{}];

    // Combine counts from both tables
    const combinedCounts = {
      permanent_count: (centerTrainingCounts.permanent_count || 0) + (batchTrainingCounts.permanent_count || 0),
      contract_count: (centerTrainingCounts.contract_count || 0) + (batchTrainingCounts.contract_count || 0),
      student_count: (centerTrainingCounts.student_count || 0) + (batchTrainingCounts.student_count || 0),
      certificate_count: (centerTrainingCounts.certificate_count || 0) + (batchTrainingCounts.certificate_count || 0),
      total_trainees: (centerTrainingCounts.total_trainees || 0) + (batchTrainingCounts.total_trainees || 0)
    };

    // Get combined employee training status
    const [centerTraining] = await conn.query(`
      SELECT 
        trainer_name as name,
        trainer_type as type,
        training_status as status,
        certification as certificate,
        center as department
      FROM center_training
      ORDER BY name
      LIMIT 50
    `) || [];

    const [batchTraining] = await conn.query(`
      SELECT 
        trainer_name as name,
        trainer_type as type,
        training_status as status,
        certification as certificate,
        departments as department
      FROM batch_training
      ORDER BY name
      LIMIT 50
    `) || [];

    const employeeTrainingStatus = [
      ...(Array.isArray(centerTraining) ? centerTraining : []),
      ...(Array.isArray(batchTraining) ? batchTraining : [])
    ];

    // Calculate percentages
    const total = combinedCounts.total_trainees || 1;
    
    return {
      keyMetrics: {
        permanentTrainees: {
          count: combinedCounts.permanent_count || 0,
          percentage: Math.round(((combinedCounts.permanent_count || 0) / total) * 1000) / 10
        },
        contractTrainees: {
          count: combinedCounts.contract_count || 0,
          percentage: Math.round(((combinedCounts.contract_count || 0) / total) * 1000) / 10
        },
        studentsTrained: {
          count: combinedCounts.student_count || 0,
          percentage: Math.round(((combinedCounts.student_count || 0) / total) * 1000) / 10
        },
        certificateStudents: {
          count: combinedCounts.certificate_count || 0,
          percentage: Math.round(((combinedCounts.certificate_count || 0) / total) * 1000) / 10
        }
      },
      traineeDistribution: {
        permanent: combinedCounts.permanent_count || 0,
        contract: combinedCounts.contract_count || 0,
        student: combinedCounts.student_count || 0,
        certificate: combinedCounts.certificate_count || 0
      },
      pieChartData: [
        { name: 'Permanent', value: combinedCounts.permanent_count || 0 },
        { name: 'Contract', value: combinedCounts.contract_count || 0 },
        { name: 'Student', value: combinedCounts.student_count || 0 },
        { name: 'Certificate', value: combinedCounts.certificate_count || 0 }
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
    console.log('Updating dashboard cache...');
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
