// src/models/BatchTraining.js

class BatchTraining {
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

    // Create a new batch training record
    async create({
        startTrainingDate,
        endTrainingDate,
        batch,
        departments,
        yearSem,
        strength,
        technology,
        labNo,
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
                `INSERT INTO batch_training 
        (start_training_date, end_training_date, batch, departments, year_sem, 
         strength, technology, lab_no, trainer_name, trainer_type, certification, 
         training_status, examination_status, employee_id, fdp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    this.formatDateForDb(startTrainingDate),
                    this.formatDateForDb(endTrainingDate),
                    batch,
                    departments,
                    yearSem,
                    strength,
                    technology,
                    labNo,
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
            console.error('Error creating batch training:', error);
            throw new Error(`Failed to create batch training record: ${error.message}`);
        }
    }

    // Find batch training by ID
    async findById(id) {
        try {
            const rows = await this.connection.query(
                `SELECT 
          id,
          start_training_date as startTrainingDate,
          end_training_date as endTrainingDate,
          batch,
          departments,
          year_sem as yearSem,
          strength,
          technology,
          lab_no as labNo,
          trainer_name as trainerName,
          trainer_type as trainerType,
          certification,
          training_status as trainingStatus,
          examination_status as examinationStatus,
          employee_id as employeeId,
          fdp,
          created_at as createdAt,
          updated_at as updatedAt
        FROM batch_training 
        WHERE id = ?`,
                [id]
            );

            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error finding batch training by ID:', error);
            throw new Error(`Failed to find batch training record: ${error.message}`);
        }
    }

    // Get all batch training records
    async getAll() {
        try {
            const rows = await this.connection.query(
                `SELECT 
          id,
          start_training_date as startTrainingDate,
          end_training_date as endTrainingDate,
          batch,
          departments,
          year_sem as yearSem,
          strength,
          technology,
          lab_no as labNo,
          trainer_name as trainerName,
          trainer_type as trainerType,
          certification,
          training_status as trainingStatus,
          examination_status as examinationStatus,
          employee_id as employeeId,
          fdp,
          created_at as createdAt,
          updated_at as updatedAt
        FROM batch_training
        ORDER BY created_at DESC`
            );

            return rows;
        } catch (error) {
            console.error('Error getting all batch trainings:', error);
            throw new Error(`Failed to get batch training records: ${error.message}`);
        }
    }

    // Update batch training
    async update(id, fields) {
        try {
            const fieldMapping = {
                startTrainingDate: 'start_training_date',
                endTrainingDate: 'end_training_date',
                batch: 'batch',
                departments: 'departments',
                yearSem: 'year_sem',
                strength: 'strength',
                technology: 'technology',
                labNo: 'lab_no',
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

            const sql = `UPDATE batch_training SET ${updates.join(', ')} WHERE id = ?`;
            console.log('Executing Update SQL:', sql);
            console.log('With values:', values);

            await this.connection.query(sql, values);

            return this.findById(id);
        } catch (error) {
            console.error('Error updating batch training:', error);
            throw new Error(`Failed to update batch training record: ${error.message}`);
        }
    }

    // Delete batch training
    async delete(id) {
        try {
            const sql = 'DELETE FROM batch_training WHERE id = ?';
            console.log('Executing Delete SQL:', sql);
            console.log('With values:', [id]);

            const result = await this.connection.query(sql, [id]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting batch training:', error);
            throw new Error('Failed to delete batch training record');
        }
    }

    // Filter by batch
    async findByBatch(batch) {
        try {
            const rows = await this.connection.query(
                `SELECT 
          id,
          start_training_date as startTrainingDate,
          end_training_date as endTrainingDate,
          batch,
          departments,
          year_sem as yearSem,
          strength,
          technology,
          lab_no as labNo,
          trainer_name as trainerName,
          trainer_type as trainerType,
          certification,
          training_status as trainingStatus,
          examination_status as examinationStatus,
          employee_id as employeeId,
          fdp,
          created_at as createdAt,
          updated_at as updatedAt
        FROM batch_training 
        WHERE batch = ?
        ORDER BY created_at DESC`,
                [batch]
            );

            return rows;
        } catch (error) {
            console.error('Error finding batch trainings by batch:', error);
            throw new Error('Failed to find batch training records');
        }
    }

    // Filter by department
    async findByDepartment(department) {
        try {
            const rows = await this.connection.query(
                `SELECT 
          id,
          start_training_date as startTrainingDate,
          end_training_date as endTrainingDate,
          batch,
          departments,
          year_sem as yearSem,
          strength,
          technology,
          lab_no as labNo,
          trainer_name as trainerName,
          trainer_type as trainerType,
          certification,
          training_status as trainingStatus,
          examination_status as examinationStatus,
          employee_id as employeeId,
          fdp,
          created_at as createdAt,
          updated_at as updatedAt
        FROM batch_training 
        WHERE departments = ?
        ORDER BY created_at DESC`,
                [department]
            );

            return rows;
        } catch (error) {
            console.error('Error finding batch trainings by department:', error);
            throw new Error('Failed to find batch training records');
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
          batch,
          departments,
          year_sem as yearSem,
          strength,
          technology,
          lab_no as labNo,
          trainer_name as trainerName,
          trainer_type as trainerType,
          certification,
          training_status as trainingStatus,
          examination_status as examinationStatus,
          employee_id as employeeId,
          fdp,
          created_at as createdAt,
          updated_at as updatedAt
        FROM batch_training 
        WHERE technology = ?
        ORDER BY created_at DESC`,
                [technology]
            );

            return rows;
        } catch (error) {
            console.error('Error finding batch trainings by technology:', error);
            throw new Error('Failed to find batch training records');
        }
    }
}

export default BatchTraining;
