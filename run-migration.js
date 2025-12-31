// Direct Database Migration Runner
import { pool } from './src/db.js';

async function runMigration() {
    console.log('\n========================================');
    console.log('🚀 RUNNING MIGRATIONS');
    console.log('========================================\n');

    console.log('Step 1: Adding age column to employees table...');
    try {
        const conn = await pool.getConnection();
        // Check if age column exists
        const [rows] = await conn.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = 'ethno_db' 
            AND TABLE_NAME = 'employees' 
            AND COLUMN_NAME = 'age'
        `);

        console.log('Rows from column check:', JSON.stringify(rows, null, 2));

        if (rows[0].count === 0) {
            // Add age column if it doesn't exist
            await conn.query(`
                ALTER TABLE employees 
                ADD COLUMN age INT AFTER department,
                ADD INDEX idx_age (age)
            `);

            // Set default age for existing records
            await conn.query(`
                UPDATE employees SET age = 30 WHERE age IS NULL
            `);

            console.log('✅ Successfully added age column to employees table');
        } else {
            console.log('ℹ️ age column already exists in employees table');
        }
        conn.release();
    } catch (error) {
        console.error('❌ Error adding age column:', error.message);
        process.exit(1);
    }

    console.log('\n========================================');
    console.log('🚀 VERIFYING TRAINING TABLES');
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
        batch VARCHAR(255) NOT NULL,
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

        // Check if sample data already exists
        const [centerCount] = await conn.query('SELECT COUNT(*) as count FROM center_training');

        if (centerCount.count === 0) {
            console.log('Step 2: Inserting sample data for center_training...');
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

        // Verify tables
        console.log('========================================');
        console.log('Step 3: Verifying tables...\n');

        const [centerFinal] = await conn.query('SELECT COUNT(*) as count FROM center_training');
        console.log(`✅ center_training: ${centerFinal.count} records`);

        if (centerFinal.count > 0) {
            const centerSample = await conn.query('SELECT id, center, technology, trainer_name FROM center_training LIMIT 2');
            centerSample.forEach(record => {
                console.log(`   - ID: ${record.id}, Center: ${record.center}, Tech: ${record.technology}, Trainer: ${record.trainer_name}`);
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
        console.log('   - center_training\n');

        console.log('✅ Sample data inserted:');
        console.log(`   - ${centerFinal.count} center training records\n`);

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
