// Test Update Non-existent ID
import { pool } from './src/db.js';
import CenterTraining from './src/models/CenterTraining.js';

async function testUpdate() {
    const model = new CenterTraining(pool);
    try {
        console.log(`Updating record ID: 9999 (should not exist)`);
        const result = await model.update(9999, {
            strength: 100
        });
        console.log('Update result:', result);
    } catch (error) {
        console.error('Update failed with error:');
        console.error(error.message);
    } finally {
        await pool.end();
    }
}

testUpdate();
