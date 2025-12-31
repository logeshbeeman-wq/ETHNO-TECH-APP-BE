// src/resolvers/employee.js
import Employee from '../models/Employee.js';
import { pool } from '../db.js';

// Helper to map DB fields (snake_case) to GraphQL fields (camelCase)
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

// Helper for input mapping (camelCase to snake_case)
const mapEmployeeInput = (input) => {
    const mapping = {
        employeeId: 'employee_id',
        centerName: 'center_name',
        trainerName: 'trainer_name',
        designation: 'designation',
        grade: 'grade',
        qualification: 'qualification',
        overallExperience: 'overall_experience',
        ethnotechExperience: 'ethnotech_experience',
        subjects: 'subjects',
        address: 'address',
        contactDetail: 'contact_detail',
        emergencyContactDetail: 'emergency_contact_detail',
        bloodGroup: 'blood_group',
        photoName: 'photo_name',
        photoUrl: 'photo_url'
    };

    const mapped = {};
    Object.keys(input).forEach(key => {
        if (mapping[key]) {
            mapped[mapping[key]] = input[key];
        } else {
            mapped[key] = input[key];
        }
    });
    return mapped;
};

export const employeeResolvers = {
    Query: {
        getEmployee: async (_, { id }, { models }) => {
            const employeeModel = models?.Employee || new Employee(pool);
            try {
                const employee = await employeeModel.findById(id);
                return mapEmployee(employee);
            } catch (error) {
                throw new Error(error.message);
            }
        },

        getEmployees: async (_, { filter = {} }, { models }) => {
            const employeeModel = models?.Employee || new Employee(pool);
            try {
                const mappedFilter = mapEmployeeInput(filter);
                const employees = await employeeModel.findAll(mappedFilter);
                return {
                    success: true,
                    employees: employees.map(mapEmployee),
                    total: employees.length,
                    message: 'Employees fetched successfully'
                };
            } catch (error) {
                return {
                    success: false,
                    employees: [],
                    total: 0,
                    message: error.message
                };
            }
        },

        getAllEmployees: async (_, __, { models }) => {
            const employeeModel = models?.Employee || new Employee(pool);
            try {
                console.log('=== getAllEmployees Resolver START ===');
                const employees = await employeeModel.findAll();
                console.log(`Found ${employees.length} employees in database`);
                return {
                    success: true,
                    employees: employees.map(mapEmployee),
                    total: employees.length,
                    message: 'Employees fetched successfully'
                };
            } catch (error) {
                console.error('Error in getAllEmployees resolver:', error);
                return {
                    success: false,
                    employees: [],
                    total: 0,
                    message: error.message
                };
            }
        },

        searchEmployees: async (_, { searchTerm }, { models }) => {
            const employeeModel = models?.Employee || new Employee(pool);
            try {
                const employees = await employeeModel.findAll({ search: searchTerm });
                return {
                    success: true,
                    employees: employees.map(mapEmployee),
                    total: employees.length,
                    message: `Found ${employees.length} employees matching "${searchTerm}"`
                };
            } catch (error) {
                return {
                    success: false,
                    employees: [],
                    total: 0,
                    message: error.message
                };
            }
        }
    },

    Mutation: {
        createEmployee: async (_, { input }, { models }) => {
            const employeeModel = models?.Employee || new Employee(pool);

            try {
                if (!input.employeeId) {
                    return { success: false, message: 'Employee ID is required', errors: ['employeeId required'] };
                }

                const taken = await employeeModel.isEmployeeIdTaken(input.employeeId);
                if (taken) {
                    return { success: false, message: 'Employee ID already exists', errors: ['Duplicate ID'] };
                }

                const mappedInput = mapEmployeeInput(input);
                const employee = await employeeModel.create(mappedInput);

                return {
                    success: true,
                    message: 'Employee created successfully',
                    employee: mapEmployee(employee),
                    errors: []
                };
            } catch (error) {
                return { success: false, message: error.message, errors: [error.message] };
            }
        },

        updateEmployee: async (_, { id, input }, { models }) => {
            const employeeModel = models?.Employee || new Employee(pool);

            try {
                const exist = await employeeModel.findById(id);
                if (!exist) {
                    return { success: false, message: 'Employee not found', errors: ['Not found'] };
                }

                if (input.employeeId && input.employeeId !== exist.employee_id) {
                    const taken = await employeeModel.isEmployeeIdTaken(input.employeeId, id);
                    if (taken) {
                        return { success: false, message: 'Employee ID already exists', errors: ['Duplicate ID'] };
                    }
                }

                const mappedInput = mapEmployeeInput(input);
                const employee = await employeeModel.update(id, mappedInput);

                return {
                    success: true,
                    message: 'Employee updated successfully',
                    employee: mapEmployee(employee),
                    errors: []
                };
            } catch (error) {
                return { success: false, message: error.message, errors: [error.message] };
            }
        },

        deleteEmployee: async (_, { id }, { models }) => {
            const employeeModel = models?.Employee || new Employee(pool);

            try {
                const employee = await employeeModel.delete(id);
                return {
                    success: !!employee,
                    message: employee ? 'Employee deleted' : 'Employee not found',
                    employee: mapEmployee(employee)
                };
            } catch (error) {
                return { success: false, message: error.message };
            }
        }
    }
};
