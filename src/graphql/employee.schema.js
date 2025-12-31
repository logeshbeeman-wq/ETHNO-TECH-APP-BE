import { gql } from 'apollo-server-express';

export const employeeTypeDefs = gql`
  type Employee {
    id: ID!
    employeeId: String!
    centerName: String
    trainerName: String
    designation: String
    grade: String
    qualification: String
    overallExperience: String
    ethnotechExperience: String
    subjects: String
    address: String
    contactDetail: String
    emergencyContactDetail: String
    bloodGroup: String
    photoName: String
    photoUrl: String
    createdAt: String
    updatedAt: String
  }

  input EmployeeInput {
    employeeId: String!
    centerName: String
    trainerName: String
    designation: String
    grade: String
    qualification: String
    overallExperience: String
    ethnotechExperience: String
    subjects: String
    address: String
    contactDetail: String
    emergencyContactDetail: String
    bloodGroup: String
    photoName: String
    photoUrl: String
  }

  input EmployeeFilterInput {
    centerName: String
    trainerName: String
    designation: String
    employeeId: String
    search: String
  }

  type EmployeeResponse {
    success: Boolean!
    message: String
    employee: Employee
    errors: [String!]
  }

  type EmployeesResponse {
    success: Boolean!
    employees: [Employee!]!
    total: Int!
    message: String
  }

  type DeleteEmployeeResponse {
    success: Boolean!
    message: String
    employee: Employee
  }

  extend type Query {
    getEmployee(id: ID!): Employee
    getEmployees(filter: EmployeeFilterInput): EmployeesResponse!
    getAllEmployees: EmployeesResponse!
    searchEmployees(searchTerm: String!): EmployeesResponse!
  }

  extend type Mutation {
    createEmployee(input: EmployeeInput!): EmployeeResponse!
    updateEmployee(id: ID!, input: EmployeeInput!): EmployeeResponse!
    deleteEmployee(id: ID!): DeleteEmployeeResponse!
  }
`;

export default employeeTypeDefs;
