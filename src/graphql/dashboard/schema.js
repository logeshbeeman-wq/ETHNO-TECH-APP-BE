// In src/graphql/dashboard/schema.js
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type KeyMetric {
    count: Int!
    percentage: Float!
  }

  type TraineeDistribution {
    permanent: Int!
    contract: Int!
    student: Int!
    certificate: Int!
  }

  type PieChartData {
    name: String!
    value: Int!
  }

  type EmployeeTrainingStatus {
    name: String
    type: String
    status: String
    certificate: String
    department: String
  }

  type DashboardStats {
    keyMetrics: KeyMetrics!
    traineeDistribution: TraineeDistribution!
    pieChartData: [PieChartData!]!
    employeeTrainingStatus: [EmployeeTrainingStatus!]!
    lastUpdated: String!
    isStale: Boolean!
  }

  type KeyMetrics {
    permanentTrainees: KeyMetric!
    contractTrainees: KeyMetric!
    studentsTrained: KeyMetric!
    certificateStudents: KeyMetric!
  }

  type Query {
    dashboardStats: DashboardStats!
  }
`;