// In src/graphql/dashboard/schema.js
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type KeyMetric {
    count: Int!
    percentage: Float!
  }

  type TraineeDistribution {
    permanent: Int!
    internalContract: Int!
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
    internalContractTrainees: KeyMetric!
    studentsTrained: KeyMetric!
    certificateStudents: KeyMetric!
    avgPercentage: Float!
  }

  type EmployeeStats {
    employeeId: String!
    name: String
    totalWeeks: Float!
    fdpCount: Int!
    certificationCount: Int!
    centerCount: Int!
    trainings: [CenterTraining!]!
  }

  type DashboardCard {
    id: ID!
    title: String!
    value: Int!
    change: Int!  
    changeType: String!
    isPercentage: Boolean
  }

  type DashboardCards {
    totalTrainees: DashboardCard!
    activeTraining: DashboardCard!
    coursesOffered: DashboardCard!
    completionRate: DashboardCard!
    lastUpdated: String!
  }

  type Query {
    dashboardStats(filter: CenterTrainingFilterInput): DashboardStats!
    dashboardCards(filter: CenterTrainingFilterInput): DashboardCards!
    employeeStats(employeeId: String!, startDate: String, endDate: String): EmployeeStats!
  }
`;