// Check Center Training Table Structure
import { pool } from './src/db.js';

async function checkStructure() {
    let conn;
    try {
        conn = await pool.getConnection();
        const structure = await conn.query('DESCRIBE center_training');
        console.log('--- center_training structure ---');
        console.table(structure);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

checkStructure();
