import { pool } from './src/db.js';

async function checkEmployees() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM employees');
        console.log('--- employees data ---');
        console.log(`Count: ${rows.length}`);
        if (rows.length > 0) {
            console.log('Sample:', rows[0]);
        }

        const centerTrainings = await conn.query('SELECT * FROM center_training');
        console.log('\n--- center_training data ---');
        console.log(`Count: ${centerTrainings.length}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

checkEmployees();
