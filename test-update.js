// Test Update Center Training
import { pool } from './src/db.js';
import CenterTraining from './src/models/CenterTraining.js';

async function testUpdate() {
    const model = new CenterTraining(pool);
    try {
        // 1. Get a record first
        const records = await model.getAll();
        if (records.length === 0) {
            console.log('No records to update');
            return;
        }
        const id = records[0].id;
        console.log(`Updating record ID: ${id}`);

        // 2. Try update
        const result = await model.update(id, {
            strength: 99,
            technology: 'Updated Tech'
        });
        console.log('Update successful:', result);
    } catch (error) {
        console.error('Update failed with error:');
        console.error(error);
    } finally {
        await pool.end();
    }
}

testUpdate();
