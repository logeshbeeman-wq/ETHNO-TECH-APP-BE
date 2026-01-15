import { pool } from './src/db.js';
import Employee from './src/models/Employee.js';

async function testResolver() {
    const employeeModel = new Employee(pool);
    try {
        const employees = await employeeModel.findAll();
        console.log('Total employees found in DB:', employees.length);

        const mapEmployee = (emp) => {
            if (!emp) return null;
            return {
                id: emp.id,
                employeeId: emp.employee_id,
                centerName: emp.center_name,
                trainerName: emp.trainer_name,
                designation: emp.designation,
                grade: emp.grade,
                qualification: emp.qualification,
                overallExperience: emp.overall_experience,
                ethnotechExperience: emp.ethnotech_experience,
                subjects: emp.subjects,
                address: emp.address,
                contactDetail: emp.contact_detail,
                emergencyContactDetail: emp.emergency_contact_detail,
                bloodGroup: emp.blood_group,
                photoName: emp.photo_name,
                photoUrl: emp.photo_url,
                createdAt: emp.created_at,
                updatedAt: emp.updated_at
            };
        };

        const mapped = employees.map(mapEmployee);
        console.log('Mapped employees sample:', JSON.stringify(mapped[0], null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await pool.end();
    }
}

testResolver();

