import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, initializeDatabase } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runAllMigrations() {
    console.log('\n========================================');
    console.log('🚀 INITIALIZING DATABASE MIGRATIONS');
    console.log('========================================\n');

    const migrationsDir = path.join(__dirname, '..', '..', 'db', 'migrations');

    // Ordered list of migrations to run
    // Using a specific order to handle dependencies if any
    const migrationFiles = [
        'create_employee_table.sql',
        'create_training_tables.sql'

    ];

    let conn;
    try {
        conn = await pool.getConnection();
        console.log('✅ Connected to database for migrations');

        for (const file of migrationFiles) {
            const filePath = path.join(migrationsDir, file);
            if (fs.existsSync(filePath)) {
                console.log(`\n📄 Running migration: ${file}...`);
                const sql = fs.readFileSync(filePath, 'utf8');

                // mariadb multipleStatements handles the whole file
                try {
                    await conn.query(sql);
                    console.log(`✅ ${file} completed successfully`);
                } catch (sqlError) {
                    // Check if it's just a duplicate entry error which often happens with sample data
                    if (sqlError.code === 'ER_DUP_ENTRY' || sqlError.errno === 1062) {
                        console.log(`ℹ️  ${file} finished with some duplicate entries (likely sample data already exists)`);
                    } else {
                        console.error(`❌ Error in ${file}:`, sqlError.message);
                        // Don't throw here if we want to continue other migrations
                    }
                }
            } else {
                console.warn(`⚠️  Migration file not found: ${file}`);
            }
        }

        // Also run module migrations if they exist
        const modulesDir = path.join(migrationsDir, 'modules');
        if (fs.existsSync(modulesDir)) {
            const moduleFiles = fs.readdirSync(modulesDir)
                .filter(f => f.endsWith('.sql'))
                .sort();

            for (const file of moduleFiles) {
                const filePath = path.join(modulesDir, file);
                console.log(`\n📄 Running module migration: ${file}...`);
                const sql = fs.readFileSync(filePath, 'utf8');
                try {
                    await conn.query(sql);
                    console.log(`✅ ${file} completed successfully`);
                } catch (sqlError) {
                    if (sqlError.code === 'ER_DUP_ENTRY' || sqlError.errno === 1062) {
                        console.log(`ℹ️  ${file} finished with some duplicate entries`);
                    } else {
                        console.error(`❌ Error in ${file}:`, sqlError.message);
                    }
                }
            }
        }

        // Initialize standard tables and default user
        await initializeDatabase();

        console.log('\n========================================');
        console.log('🎉 ALL MIGRATIONS COMPLETED');
        console.log('========================================\n');

    } catch (error) {
        console.error('\n❌ CRITICAL MIGRATION ERROR:');
        console.error(error.message);
    } finally {
        if (conn) conn.release();
    }
}
