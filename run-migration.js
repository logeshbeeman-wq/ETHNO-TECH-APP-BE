// Direct Database Migration Runner
import { pool } from './src/db.js';

async function runMigration() {
    console.log('\n========================================');
    console.log('🚀 CREATING TRAINING TABLES');
    console.log('========================================\n');

    let conn;
    try {
        conn = await pool.getConnection();
        console.log('✅ Connected to database: ethno_db\n');

        // Create center_training table
        console.log('Step 1: Creating center_training table...');
        await conn.query(`
      CREATE TABLE IF NOT EXISTS center_training (
        id INT AUTO_INCREMENT PRIMARY KEY,
        start_training_date DATE NOT NULL,
        end_training_date DATE NOT NULL,
        center VARCHAR(255) NOT NULL,
        strength INT NOT NULL,
        technology VARCHAR(255) NOT NULL,
        trainer_name VARCHAR(255) NOT NULL,
        trainer_type VARCHAR(100) NOT NULL,
        certification VARCHAR(255) NOT NULL,
        training_status VARCHAR(50) NOT NULL,
        examination_status VARCHAR(50) NOT NULL,
        employee_id VARCHAR(100) NOT NULL,
        fdp VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_center (center),
        INDEX idx_technology (technology),
        INDEX idx_employee_id (employee_id),
        INDEX idx_training_dates (start_training_date, end_training_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('✅ center_training table created\n');

        // Create batch_training table
        console.log('Step 2: Creating batch_training table...');
        await conn.query(`
      CREATE TABLE IF NOT EXISTS batch_training (
        id INT AUTO_INCREMENT PRIMARY KEY,
        start_training_date DATE NOT NULL,
        end_training_date DATE NOT NULL,
        batch VARCHAR(100) NOT NULL,
        departments VARCHAR(255) NOT NULL,
        year_sem VARCHAR(50) NOT NULL,
        strength INT NOT NULL,
        technology VARCHAR(255) NOT NULL,
        lab_no VARCHAR(100) NOT NULL,
        trainer_name VARCHAR(255) NOT NULL,
        trainer_type VARCHAR(100) NOT NULL,
        certification VARCHAR(255) NOT NULL,
        training_status VARCHAR(50) NOT NULL,
        examination_status VARCHAR(50) NOT NULL,
        employee_id VARCHAR(100) NOT NULL,
        fdp VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_batch (batch),
        INDEX idx_departments (departments),
        INDEX idx_technology (technology),
        INDEX idx_employee_id (employee_id),
        INDEX idx_training_dates (start_training_date, end_training_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('✅ batch_training table created\n');

        // Check if sample data already exists
        const [centerCount] = await conn.query('SELECT COUNT(*) as count FROM center_training');

        if (centerCount.count === 0) {
            console.log('Step 3: Inserting sample data for center_training...');
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
            console.log('✅ Sample data inserted (2 records)\n');
        } else {
            console.log(`ℹ️  center_training already has ${centerCount.count} records, skipping sample data\n`);
        }

        const [batchCount] = await conn.query('SELECT COUNT(*) as count FROM batch_training');

        if (batchCount.count === 0) {
            console.log('Step 4: Inserting sample data for batch_training...');
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
            console.log('✅ Sample data inserted (2 records)\n');
        } else {
            console.log(`ℹ️  batch_training already has ${batchCount.count} records, skipping sample data\n`);
        }

        // Verify tables
        console.log('========================================');
        console.log('Step 5: Verifying tables...\n');

        const [centerFinal] = await conn.query('SELECT COUNT(*) as count FROM center_training');
        console.log(`✅ center_training: ${centerFinal.count} records`);

        if (centerFinal.count > 0) {
            const centerSample = await conn.query('SELECT id, center, technology, trainer_name FROM center_training LIMIT 2');
            console.log('   Sample records:');
            centerSample.forEach(record => {
                console.log(`   - ID: ${record.id}, Center: ${record.center}, Tech: ${record.technology}, Trainer: ${record.trainer_name}`);
            });
        }
        console.log('');

        const [batchFinal] = await conn.query('SELECT COUNT(*) as count FROM batch_training');
        console.log(`✅ batch_training: ${batchFinal.count} records`);

        if (batchFinal.count > 0) {
            const batchSample = await conn.query('SELECT id, batch, departments, technology, trainer_name FROM batch_training LIMIT 2');
            console.log('   Sample records:');
            batchSample.forEach(record => {
                console.log(`   - ID: ${record.id}, Batch: ${record.batch}, Dept: ${record.departments}, Tech: ${record.technology}`);
            });
        }
        console.log('');

        // List all tables
        console.log('========================================');
        console.log('📋 All tables in database:\n');
        const tables = await conn.query('SHOW TABLES');
        tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            const icon = tableName.includes('training') ? '🎓' : '👤';
            console.log(`   ${icon} ${index + 1}. ${tableName}`);
        });
        console.log('');

        console.log('========================================');
        console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
        console.log('========================================\n');

        console.log('✅ Tables created:');
        console.log('   - center_training');
        console.log('   - batch_training\n');

        console.log('✅ Sample data inserted:');
        console.log(`   - ${centerFinal.count} center training records`);
        console.log(`   - ${batchFinal.count} batch training records\n`);

        console.log('🚀 Next steps:');
        console.log('   1. Your GraphQL API is ready to use!');
        console.log('   2. Open: http://localhost:4000/graphql');
        console.log('   3. Try query: { centerTrainings { id center technology } }');
        console.log('   4. Check docs: docs/TRAINING_API.md\n');

    } catch (error) {
        console.error('\n❌ MIGRATION FAILED!');
        console.error('Error:', error.message);
        if (error.sqlMessage) {
            console.error('SQL Error:', error.sqlMessage);
        }
        console.log('');
    } finally {
        if (conn) {
            await conn.release();
            console.log('🔌 Connection released\n');
        }
        await pool.end();
    }
}

runMigration();
