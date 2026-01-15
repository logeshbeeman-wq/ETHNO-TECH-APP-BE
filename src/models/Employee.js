// src/models/Employee.js
class Employee {
  constructor(connection) {
    this.connection = connection;
  }

  // Create a new employee
  async create(data) {
    try {
      const {
        employee_id, center_name, trainer_name, designation, grade,
        qualification, overall_experience, ethnotech_experience,
        subjects, address, contact_detail, emergency_contact_detail,
        blood_group, photo_name, photo_url
      } = data;

      const result = await this.connection.query(
        `INSERT INTO employees (
          employee_id, center_name, trainer_name, designation, grade,
          qualification, overall_experience, ethnotech_experience,
          subjects, address, contact_detail, emergency_contact_detail,
          blood_group, photo_name, photo_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          employee_id, center_name, trainer_name, designation, grade,
          qualification, overall_experience, ethnotech_experience,
          subjects, address, contact_detail, emergency_contact_detail,
          blood_group, photo_name, photo_url
        ]
      );

      const insertId = result.insertId;
      return this.findById(insertId);
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Failed to create employee: ' + error.message);
    }
  }

  // Find employee by ID
  async findById(id) {
    try {
      const rows = await this.connection.query(
        `SELECT 
          id, 
          employee_id, 
          center_name, 
          trainer_name, 
          designation, 
          grade,
          qualification, 
          overall_experience, 
          ethnotech_experience, 
          subjects, 
          address, 
          contact_detail, 
          emergency_contact_detail, 
          blood_group, 
          photo_name, 
          photo_url,
          created_at, 
          updated_at 
        FROM employees 
        WHERE id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding employee by ID:', error);
      throw new Error('Failed to find employee');
    }
  }

  // Find all employees with optional filters
  async findAll({ center_name, trainer_name, designation, employee_id, search } = {}) {
    try {
      let query = `
        SELECT 
          id, 
          employee_id, 
          center_name, 
          trainer_name, 
          designation, 
          grade,
          qualification, 
          overall_experience, 
          ethnotech_experience, 
          subjects, 
          address, 
          contact_detail, 
          emergency_contact_detail, 
          blood_group, 
          photo_name, 
          photo_url,
          created_at, 
          updated_at 
        FROM employees
        WHERE 1=1
      `;
      const params = [];

      if (center_name) {
        query += ' AND center_name LIKE ?';
        params.push(`%${center_name}%`);
      }

      if (trainer_name) {
        query += ' AND trainer_name LIKE ?';
        params.push(`%${trainer_name}%`);
      }

      if (designation) {
        query += ' AND designation LIKE ?';
        params.push(`%${designation}%`);
      }

      if (employee_id) {
        query += ' AND employee_id LIKE ?';
        params.push(`%${employee_id}%`);
      }

      if (search) {
        query += ' AND (trainer_name LIKE ? OR employee_id LIKE ? OR designation LIKE ?)';
        const searchVal = `%${search}%`;
        params.push(searchVal, searchVal, searchVal);
      }

      query += ' ORDER BY created_at DESC';

      const rows = await this.connection.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error finding employees:', error);
      throw new Error('Failed to retrieve employees');
    }
  }

  // Update an employee
  async update(id, fields) {
    try {
      const updates = [];
      const params = [];

      const allowedFields = [
        'employee_id', 'center_name', 'trainer_name', 'designation', 'grade',
        'qualification', 'overall_experience', 'ethnotech_experience',
        'subjects', 'address', 'contact_detail', 'emergency_contact_detail',
        'blood_group', 'photo_name', 'photo_url'
      ];

      allowedFields.forEach(field => {
        if (fields[field] !== undefined) {
          updates.push(`${field} = ?`);
          params.push(fields[field]);
        }
      });

      if (updates.length === 0) {
        return this.findById(id);
      }

      params.push(id);

      await this.connection.query(
        `UPDATE employees SET ${updates.join(', ')} WHERE id = ?`,
        params
      );

      return this.findById(id);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Failed to update employee');
    }
  }

  // Delete an employee
  async delete(id) {
    try {
      const employee = await this.findById(id);
      if (!employee) {
        return null;
      }
      await this.connection.query('DELETE FROM employees WHERE id = ?', [id]);
      return employee;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Failed to delete employee');
    }
  }

  // Check if employee_id already exists
  async isEmployeeIdTaken(employeeId, excludeId = null) {
    try {
      let query = 'SELECT id FROM employees WHERE employee_id = ?';
      const params = [employeeId];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const rows = await this.connection.query(query, params);
      return rows.length > 0;
    } catch (error) {
      console.error('Error checking employee_id:', error);
      throw new Error('Failed to check employee ID availability');
    }
  }
}

export default Employee;
