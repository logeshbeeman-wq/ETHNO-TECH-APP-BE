// src/models/CenterTraining.js

class CenterTraining {
    constructor(connection) {
        this.connection = connection;
    }

    // Helper to ensure dates are in YYYY-MM-DD format
    formatDateForDb(dateInput) {
        if (!dateInput) return null;
        try {
            if (!isNaN(dateInput) && !isNaN(parseFloat(dateInput))) {
                return new Date(Number(dateInput)).toISOString().split('T')[0];
            }
            const d = new Date(dateInput);
            if (!isNaN(d.getTime())) {
                return d.toISOString().split('T')[0];
            }
        } catch (error) {
            console.error('Date parsing error:', error);
        }
        return dateInput;
    }

    // Create a new center training record
    async create(data) {
        try {
            const {
                centerId, startTrainingDate, endTrainingDate, center,
                batch, departments, yearSem, strength, technology,
                labNo, trainerName, trainerType, certification,
                trainingStatus, examinationStatus, employeeId,
                fdpReceived, fdpTaken
            } = data;

            const result = await this.connection.query(
                `INSERT INTO center_training 
        (center_id, start_training_date, end_training_date, center, batch, departments, year_sem, 
         strength, technology, lab_no, trainer_name, trainer_type, certification, 
         training_status, examination_status, employee_id, fdp_received, fdp_taken) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    centerId,
                    this.formatDateForDb(startTrainingDate),
                    this.formatDateForDb(endTrainingDate),
                    center,
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
                    fdpReceived,
                    fdpTaken
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
          center_id as centerId,
          DATE_FORMAT(start_training_date, '%Y-%m-%d') as startTrainingDate,
          DATE_FORMAT(end_training_date, '%Y-%m-%d') as endTrainingDate,
          center,
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
          fdp_received as fdpReceived,
          fdp_taken as fdpTaken,
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
          center_id as centerId,
          start_training_date as startTrainingDate,
          end_training_date as endTrainingDate,
          center,
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
          fdp_received as fdpReceived,
          fdp_taken as fdpTaken,
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
                centerId: 'center_id',
                startTrainingDate: 'start_training_date',
                endTrainingDate: 'end_training_date',
                center: 'center',
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
                fdpReceived: 'fdp_received',
                fdpTaken: 'fdp_taken'
            };

            const updates = [];
            const values = [];

            Object.keys(fields).forEach(key => {
                if (fieldMapping[key] && fields[key] !== undefined) {
                    updates.push(`${fieldMapping[key]} = ?`);
                    if (key === 'startTrainingDate' || key === 'endTrainingDate') {
                        values.push(this.formatDateForDb(fields[key]));
                    } else {
                        values.push(fields[key]);
                    }
                }
            });

            if (updates.length === 0) {
                return this.findById(id);
            }

            values.push(id);
            await this.connection.query(`UPDATE center_training SET ${updates.join(', ')} WHERE id = ?`, values);
            return this.findById(id);
        } catch (error) {
            console.error('Error updating center training:', error);
            throw new Error(`Failed to update center training record: ${error.message}`);
        }
    }

    // Delete center training
    async delete(id) {
        try {
            const result = await this.connection.query('DELETE FROM center_training WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting center training:', error);
            throw new Error('Failed to delete center training record');
        }
    }

    // Dynamic filtering for Center Training
    async findFiltered(filter = {}) {
        try {
            let sql = `
            SELECT 
                id,
                center_id as centerId,
                DATE_FORMAT(start_training_date, '%Y-%m-%d') as startTrainingDate,
                DATE_FORMAT(end_training_date, '%Y-%m-%d') as endTrainingDate,
                center,
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
                fdp_received as fdpReceived,
                fdp_taken as fdpTaken,
                created_at as createdAt,
                updated_at as updatedAt
            FROM center_training 
            WHERE 1=1
            `;
            const params = [];

            const mapping = {
                centerId: 'center_id',
                center: 'center',
                batch: 'batch',
                yearSem: 'year_sem',
                technology: 'technology',
                trainerType: 'trainer_type',
                trainingStatus: 'training_status',
                trainerName: 'trainer_name'
            };

            Object.keys(filter).forEach(key => {
                if (mapping[key] && filter[key] !== undefined && filter[key] !== null) {
                    sql += ` AND ${mapping[key]} = ?`;
                    params.push(filter[key]);
                }
            });

            sql += ' ORDER BY start_training_date DESC';
            const rows = await this.connection.query(sql, params);
            return rows;
        } catch (error) {
            console.error('Error in findFiltered:', error);
            throw new Error(`Failed to filter center training records: ${error.message}`);
        }
    }
}

export default CenterTraining;
