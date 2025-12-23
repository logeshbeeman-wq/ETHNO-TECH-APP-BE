// Diagnose User Query Issue
import { pool } from './src/db.js';

async function diagnoseUsers() {
    console.log('\n========================================');
    console.log('🔍 DIAGNOSING USER QUERY ISSUE');
    console.log('========================================\n');

    let conn;
    try {
        conn = await pool.getConnection();

        // Test 1: Get all users
        console.log('Test 1: SELECT * FROM users\n');
        const result1 = await conn.query('SELECT * FROM users');
        console.log('Raw result type:', Array.isArray(result1) ? 'Array' : typeof result1);
        console.log('Raw result length:', result1.length);
        console.log('Raw result:', JSON.stringify(result1, null, 2));
        console.log('\n---\n');

        // Test 2: Get users with WHERE clause
        console.log('Test 2: SELECT * FROM users WHERE role != \'superadmin\'\n');
        const result2 = await conn.query('SELECT * FROM users WHERE role != ?', ['superadmin']);
        console.log('Raw result type:', Array.isArray(result2) ? 'Array' : typeof result2);
        console.log('Raw result length:', result2.length);
        console.log('Raw result:', JSON.stringify(result2, null, 2));
        console.log('\n---\n');

        // Test 3: With array destructuring
        console.log('Test 3: Using array destructuring [rows]\n');
        const [rows] = await conn.query('SELECT * FROM users WHERE role != ?', ['superadmin']);
        console.log('Destructured result type:', Array.isArray(rows) ? 'Array' : typeof rows);
        console.log('Destructured result:', JSON.stringify(rows, null, 2));
        console.log('\n---\n');

        // Test 4: Count users
        console.log('Test 4: Count queries\n');
        const totalUsers = await conn.query('SELECT COUNT(*) as count FROM users');
        console.log('Total users:', JSON.stringify(totalUsers, null, 2));

        const regularUsers = await conn.query('SELECT COUNT(*) as count FROM users WHERE role != ?', ['superadmin']);
        console.log('Regular users (non-superadmin):', JSON.stringify(regularUsers, null, 2));
        console.log('\n---\n');

        // Test 5: List all users with roles
        console.log('Test 5: All users with roles\n');
        const allUsers = await conn.query('SELECT id, username, email, role FROM users ORDER BY id');
        console.log('Users:');
        if (Array.isArray(allUsers)) {
            allUsers.forEach((user, index) => {
                console.log(`  ${index + 1}. ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Email: ${user.email}`);
            });
        }
        console.log('\n');

        console.log('========================================');
        console.log('📊 SUMMARY');
        console.log('========================================');
        console.log('✅ MariaDB returns results directly as an array');
        console.log('✅ No need for array destructuring [rows]');
        console.log('⚠️  The getAllExceptSuperadmin method should NOT use [rows]');
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

diagnoseUsers();
