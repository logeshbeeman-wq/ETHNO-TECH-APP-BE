// src/models/CenterTraining.js

class CenterTraining {
    constructor(connection) {
        this.connection = connection;
    }

    // Helper to ensure dates are in YYYY-MM-DD format
    formatDateForDb(dateInput) {
        if (!dateInput) return null;
        try {
            // If it's a timestamp string or number (like '1766601000000')
            if (!isNaN(dateInput) && !isNaN(parseFloat(dateInput))) {
                return new Date(Number(dateInput)).toISOString().split('T')[0];
            }
            // If it's a generic date string, try to parse and format it
            const d = new Date(dateInput);
            if (!isNaN(d.getTime())) {
                return d.toISOString().split('T')[0];
            }
        } catch (error) {
            console.error('Date parsing error:', error);
        }
        return dateInput; // Fallback
    }

    // Create a new center training record
    async create({
        startTrainingDate,
        endTrainingDate,
        center,
        strength,
        technology,
        trainerName,
        trainerType,
        certification,
        trainingStatus,
        examinationStatus,
        employeeId,
        fdp
    }) {
        try {
            const result = await this.connection.query(
                `INSERT INTO center_training 
        (start_training_date, end_training_date, center, strength, technology, 
         trainer_name, trainer_type, certification, training_status, 
         examination_status, employee_id, fdp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    this.formatDateForDb(startTrainingDate),
                    this.formatDateForDb(endTrainingDate),
                    center,
                    strength,
                    technology,
                    trainerName,
                    trainerType,
                    certification,
                    trainingStatus,
                    examinationStatus,
                    employeeId,
                    fdp
                ]
            );

            return this.findById(result.insertId);
        } catch (error) {
            console.error('Error creating center training:', error);
            throw new Error(`Failed to create center training record: ${error.message}`);
        }
    }

    // Find center training by ID
    async findById(id) {
        try {
            const rows = await this.connection.query(
                `SELECT 
          id,
          DATE_FORMAT(start_training_date, '%Y-%m-%d') as startTrainingDate,
          DATE_FORMAT(end_training_date, '%Y-%m-%d') as endTrainingDate,
          center,
          strength,
          technology,
          trainer_name as trainerName,
          trainer_type as trainerType,
          certification,
          training_status as trainingStatus,
          examination_status as examinationStatus,
          employee_id as employeeId,
          fdp,
          created_at as createdAt,
          updated_at as updatedAt
        FROM center_training 
        WHERE id = ?`,
                [id]
            );

            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error finding center training by ID:', error);
            throw new Error(`Failed to find center training record: ${error.message}`);
        }
    }

    // Get all center training records
    async getAll() {
        try {
            const rows = await this.connection.query(
                `SELECT 
          id,
          start_training_date as startTrainingDate,
          end_training_date as endTrainingDate,
          center,
          strength,
          technology,
          trainer_name as trainerName,
          trainer_type as trainerType,
          certification,
          training_status as trainingStatus,
          examination_status as examinationStatus,
          employee_id as employeeId,
          fdp,
          created_at as createdAt,
          updated_at as updatedAt
        FROM center_training
        ORDER BY created_at DESC`
            );

            return rows;
        } catch (error) {
            console.error('Error getting all center trainings:', error);
            throw new Error(`Failed to get center training records: ${error.message}`);
        }
    }

    // Update center training
    async update(id, fields) {
        try {
            const fieldMapping = {
                startTrainingDate: 'start_training_date',
                endTrainingDate: 'end_training_date',
                center: 'center',
                strength: 'strength',
                technology: 'technology',
                trainerName: 'trainer_name',
                trainerType: 'trainer_type',
                certification: 'certification',
                trainingStatus: 'training_status',
                examinationStatus: 'examination_status',
                employeeId: 'employee_id',
                fdp: 'fdp'
            };

            const updates = [];
            const values = [];

            Object.keys(fields).forEach(key => {
                if (fieldMapping[key] && fields[key] !== undefined) {
                    updates.push(`${fieldMapping[key]} = ?`);

                    // Format if it's a date field
                    if (key === 'startTrainingDate' || key === 'endTrainingDate') {
                        values.push(this.formatDateForDb(fields[key]));
                    } else {
                        values.push(fields[key]);
                    }
                }
            });

            if (updates.length === 0) {
                throw new Error('No valid fields provided for update');
            }

            values.push(id);

            const sql = `UPDATE center_training SET ${updates.join(', ')} WHERE id = ?`;
            console.log('Executing Center Update SQL:', sql);
            console.log('With values:', values);

            await this.connection.query(sql, values);

            return this.findById(id);
        } catch (error) {
            console.error('Error updating center training:', error);
            throw new Error(`Failed to update center training record: ${error.message}`);
        }
    }

    // Delete center training
    async delete(id) {
        try {
            const result = await this.connection.query(
                'DELETE FROM center_training WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting center training:', error);
            throw new Error('Failed to delete center training record');
        }
    }

    // Filter by center
    // In src/models/CenterTraining.js, update the findByCenter method
async findByCenter(center) {
    try {
        const rows = await this.connection.query(`
            SELECT 
                id,
                DATE_FORMAT(start_training_date, '%Y-%m-%d') as startTrainingDate,
                DATE_FORMAT(end_training_date, '%Y-%m-%d') as endTrainingDate,
                center,
                strength,
                technology,
                trainer_name as trainerName,
                trainer_type as trainerType,
                certification,
                training_status as trainingStatus,
                examination_status as examinationStatus,
                employee_id as employeeId,
                fdp
            FROM center_training 
            WHERE center = ?
            ORDER BY start_training_date DESC`, 
            [center]
        );
        return rows;
    } catch (error) {
        console.error('Error finding center training by center:', error);
        throw new Error(`Failed to find center training records: ${error.message}`);
    }
}

// In src/models/CenterTraining.js, update the findByTechnology method
async findByTechnology(technology) {
    try {
        const rows = await this.connection.query(`
            SELECT 
                id,
                DATE_FORMAT(start_training_date, '%Y-%m-%d') as startTrainingDate,
                DATE_FORMAT(end_training_date, '%Y-%m-%d') as endTrainingDate,
                center,
                strength,
                technology,
                trainer_name as trainerName,
                trainer_type as trainerType,
                certification,
                training_status as trainingStatus,
                examination_status as examinationStatus,
                employee_id as employeeId,
                fdp
            FROM center_training 
            WHERE technology = ?
            ORDER BY start_training_date DESC`, 
            [technology]
        );
        return rows;
    } catch (error) {
        console.error('Error finding center training by technology:', error);
        throw new Error(`Failed to find center training records: ${error.message}`);
    }
}

    // Filter by technology
    async findByTechnology(technology) {
        try {
            const rows = await this.connection.query(
                `SELECT 
          id,
          start_training_date as startTrainingDate,
          end_training_date as endTrainingDate,
          center,
          strength,
          technology,
          trainer_name as trainerName,
          trainer_type as trainerType,
          certification,
          training_status as trainingStatus,
          examination_status as examinationStatus,
          employee_id as employeeId,
          fdp,
          created_at as createdAt,
          updated_at as updatedAt
        FROM center_training 
        WHERE technology = ?
        ORDER BY created_at DESC`,
                [technology]
            );

            return rows;
        } catch (error) {
            console.error('Error finding center trainings by technology:', error);
            throw new Error('Failed to find center training records');
        }
    }
}

export default CenterTraining;
