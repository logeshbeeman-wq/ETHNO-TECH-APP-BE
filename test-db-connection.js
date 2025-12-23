// Test Database Connection and Training Tables
import { pool } from './src/db.js';

async function testDatabaseConnection() {
    console.log('\n========================================');
    console.log('🔍 DATABASE CONNECTION TEST');
    console.log('========================================\n');

    let conn;
    try {
        // Step 1: Test basic connection
        console.log('Step 1: Testing database connection...');
        conn = await pool.getConnection();
        console.log('✅ Database connection successful!\n');

        // Step 2: Get database info
        console.log('Step 2: Fetching database information...');
        const [dbInfo] = await conn.query('SELECT DATABASE() as db, USER() as user, VERSION() as version');
        console.log('📊 Database Info:');
        console.log(`   Database: ${dbInfo.db}`);
        console.log(`   User: ${dbInfo.user}`);
        console.log(`   Version: ${dbInfo.version}\n`);

        // Step 3: List all tables
        console.log('Step 3: Checking available tables...');
        const tables = await conn.query('SHOW TABLES');
        console.log(`📋 Total Tables: ${tables.length}`);
        tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            console.log(`   ${index + 1}. ${tableName}`);
        });
        console.log('');

        // Step 4: Check for training tables
        console.log('Step 4: Checking for training tables...');
        const centerTrainingExists = tables.some(t => Object.values(t)[0] === 'center_training');
        const batchTrainingExists = tables.some(t => Object.values(t)[0] === 'batch_training');

        if (centerTrainingExists) {
            console.log('✅ center_training table exists');

            // Get count
            const [centerCount] = await conn.query('SELECT COUNT(*) as count FROM center_training');
            console.log(`   Records: ${centerCount.count}`);

            // Get sample data
            if (centerCount.count > 0) {
                const centerSample = await conn.query('SELECT * FROM center_training LIMIT 1');
                console.log('   Sample record:', JSON.stringify(centerSample[0], null, 2));
            }
        } else {
            console.log('❌ center_training table NOT found');
            console.log('   ⚠️  Please run: db/migrations/create_training_tables.sql');
        }
        console.log('');

        if (batchTrainingExists) {
            console.log('✅ batch_training table exists');

            // Get count
            const [batchCount] = await conn.query('SELECT COUNT(*) as count FROM batch_training');
            console.log(`   Records: ${batchCount.count}`);

            // Get sample data
            if (batchCount.count > 0) {
                const batchSample = await conn.query('SELECT * FROM batch_training LIMIT 1');
                console.log('   Sample record:', JSON.stringify(batchSample[0], null, 2));
            }
        } else {
            console.log('❌ batch_training table NOT found');
            console.log('   ⚠️  Please run: db/migrations/create_training_tables.sql');
        }
        console.log('');

        // Step 5: Check users table
        console.log('Step 5: Checking users table...');
        const usersExists = tables.some(t => Object.values(t)[0] === 'users');
        if (usersExists) {
            const [userCount] = await conn.query('SELECT COUNT(*) as count FROM users');
            console.log(`✅ users table exists (${userCount.count} users)`);

            // Check for admin users
            const adminUsers = await conn.query("SELECT username, email, role FROM users WHERE role IN ('admin', 'superadmin')");
            if (adminUsers.length > 0) {
                console.log('   Admin users:');
                adminUsers.forEach(user => {
                    console.log(`   - ${user.username} (${user.email}) - Role: ${user.role}`);
                });
            }
        } else {
            console.log('❌ users table NOT found');
        }
        console.log('');

        // Step 6: Connection pool status
        console.log('Step 6: Connection pool status...');
        console.log(`   Active connections: ${pool.activeConnections()}`);
        console.log(`   Total connections: ${pool.totalConnections()}`);
        console.log(`   Idle connections: ${pool.idleConnections()}`);
        console.log('');

        // Summary
        console.log('========================================');
        console.log('📊 SUMMARY');
        console.log('========================================');
        console.log(`✅ Database: ${dbInfo.db}`);
        console.log(`✅ Connection: Successful`);
        console.log(`✅ Total Tables: ${tables.length}`);
        console.log(`${centerTrainingExists ? '✅' : '❌'} Center Training Table: ${centerTrainingExists ? 'Ready' : 'Missing'}`);
        console.log(`${batchTrainingExists ? '✅' : '❌'} Batch Training Table: ${batchTrainingExists ? 'Ready' : 'Missing'}`);
        console.log(`${usersExists ? '✅' : '❌'} Users Table: ${usersExists ? 'Ready' : 'Missing'}`);

        if (!centerTrainingExists || !batchTrainingExists) {
            console.log('\n⚠️  ACTION REQUIRED:');
            console.log('   Run the migration file to create training tables:');
            console.log('   db/migrations/create_training_tables.sql');
        } else {
            console.log('\n🎉 All training tables are ready!');
            console.log('   You can now use the GraphQL API.');
        }
        console.log('========================================\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('Details:', {
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
        console.log('\n⚠️  Troubleshooting:');
        console.log('   1. Check your .env file for correct database credentials');
        console.log('   2. Ensure MySQL/MariaDB server is running');
        console.log('   3. Verify database exists: ' + process.env.DB_NAME);
        console.log('');
    } finally {
        if (conn) {
            await conn.release();
            console.log('🔌 Database connection released\n');
        }
        await pool.end();
        console.log('👋 Connection pool closed\n');
    }
}

// Run the test
testDatabaseConnection();
