// Insert Sample Data
import { pool } from './src/db.js';

async function insertSampleData() {
  console.log('\n🔄 Inserting sample data...\n');

  let conn;
  try {
    conn = await pool.getConnection();

    // Insert center training data
    console.log('Inserting center_training records...');
    await conn.query(`
      INSERT INTO center_training 
        (start_training_date, end_training_date, center, strength, technology, 
         trainer_name, trainer_type, certification, training_status, 
         examination_status, employee_id, fdp) 
      VALUES 
        ('2024-01-15', '2024-02-15', 'Main Campus', 30, 'React.js', 
         'John Doe', 'Internal', 'AWS Certified', 'Y', 
         'Completed', 'EMP001', 'Advanced Web Development'),
        ('2024-02-01', '2024-03-01', 'Branch Campus', 25, 'Python', 
         'Jane Smith', 'External', 'Python Expert', 'Y', 
         'Pending', 'EMP002', 'Data Science Fundamentals')
    `);
    console.log('✅ 2 center_training records inserted\n');

    // Verify
    const [centerCount] = await conn.query('SELECT COUNT(*) as count FROM center_training');

    console.log('📊 Final counts:');
    console.log(`   center_training: ${centerCount.count} records\n`);

    console.log('🎉 Sample data inserted successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

insertSampleData();
