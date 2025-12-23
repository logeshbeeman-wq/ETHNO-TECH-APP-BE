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

        // Insert batch training data
        console.log('Inserting batch_training records...');
        await conn.query(`
      INSERT INTO batch_training 
        (start_training_date, end_training_date, batch, departments, year_sem, 
         strength, technology, lab_no, trainer_name, trainer_type, certification, 
         training_status, examination_status, employee_id, fdp) 
      VALUES 
        ('2024-01-10', '2024-02-10', 'Batch A', 'Computer Science', '3rd Year - Sem 5', 
         35, 'Machine Learning', 'Lab 101', 'Dr. Robert Brown', 'Internal', 'ML Certified', 
         'Y', 'Completed', 'EMP003', 'AI and ML Workshop'),
        ('2024-02-05', '2024-03-05', 'Batch B', 'Information Technology', '2nd Year - Sem 4', 
         40, 'Cloud Computing', 'Lab 202', 'Sarah Johnson', 'External', 'Azure Certified', 
         'Y', 'In Progress', 'EMP004', 'Cloud Technologies')
    `);
        console.log('✅ 2 batch_training records inserted\n');

        // Verify
        const [centerCount] = await conn.query('SELECT COUNT(*) as count FROM center_training');
        const [batchCount] = await conn.query('SELECT COUNT(*) as count FROM batch_training');

        console.log('📊 Final counts:');
        console.log(`   center_training: ${centerCount.count} records`);
        console.log(`   batch_training: ${batchCount.count} records\n`);

        console.log('🎉 Sample data inserted successfully!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

insertSampleData();
