const fs = require('fs').promises;
const path = require('path');
const { pool } = require('./db');

class Migrator {
  constructor() {
    this.migrationsPath = path.join(__dirname, '../../db/migrations/modules');
    this.migrationsTable = 'migrations';
  }

  async init() {
    await this.createMigrationsTable();
    await this.runMigrations();
  }

  async createMigrationsTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ${this.migrationsTable} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await pool.query(createTableSQL);
  }

  async getExecutedMigrations() {
    try {
      const [rows] = await pool.query(`SELECT name FROM ${this.migrationsTable} ORDER BY name`);
      return rows.map(row => row.name);
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return [];
      }
      throw error;
    }
  }

  async getMigrationFiles() {
    const files = await fs.readdir(this.migrationsPath);
    return files
      .filter(file => file.endsWith('.sql'))
      .sort();
  }

  async readMigrationFile(filename) {
    const filePath = path.join(this.migrationsPath, filename);
    return fs.readFile(filePath, 'utf8');
  }

  async runMigrations() {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = await this.getMigrationFiles();
      
      let migrationsRun = 0;
      
      for (const file of migrationFiles) {
        if (!executedMigrations.includes(file)) {
          console.log(`Running migration: ${file}`);
          const sql = await this.readMigrationFile(file);
          
          // Split SQL by semicolon and execute each statement
          const statements = sql.split(';').filter(statement => statement.trim() !== '');
          
          for (const statement of statements) {
            if (statement.trim() !== '') {
              await conn.query(statement);
            }
          }
          
          // Record migration
          await conn.query(
            `INSERT INTO ${this.migrationsTable} (name) VALUES (?)`,
            [file]
          );
          
          migrationsRun++;
          console.log(`Successfully executed migration: ${file}`);
        }
      }
      
      if (migrationsRun > 0) {
        await conn.commit();
        console.log(`Successfully ran ${migrationsRun} migration(s)`);
      } else {
        console.log('No new migrations to run');
      }
      
      return migrationsRun;
    } catch (error) {
      await conn.rollback();
      console.error('Migration failed:', error);
      throw error;
    } finally {
      conn.release();
    }
  }
}

module.exports = new Migrator();
