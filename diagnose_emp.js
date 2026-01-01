
import { pool } from './src/db.js';

async function diagnoseEmployee() {
    const employeeId = 'EMP789';
    try {
        console.log(`=== Diagnosing Training Records for: ${employeeId} ===`);

        // 1. Check if ANY records exist for this employeeId
        const records = await pool.query("SELECT * FROM center_training WHERE employee_id = ?", [employeeId]);
        console.log(`Found ${records.length} records specifically for '${employeeId}'`);

        if (records.length > 0) {
            console.log('Sample Record:', JSON.stringify(records[0], null, 2));
        } else {
            // 2. If not found, check for similar IDs or whitespace issues
            console.log('No exact match. checking for similar IDs (LIKE)...');
            const similar = await pool.query("SELECT DISTINCT employee_id FROM center_training WHERE employee_id LIKE ?", [`%${employeeId}%`]);
            console.log('Similar IDs in DB:', similar);

            // 3. Check total records in table to ensure it's not empty
            const total = await pool.query("SELECT COUNT(*) as count FROM center_training");
            console.log('Total records in center_training table:', total[0].count);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

diagnoseEmployee();
