// src/graphql/training.schema.js
import { gql } from 'graphql-tag';

export const trainingTypeDefs = gql`
  # Center Training Type
  type CenterTraining {
    id: ID!
    centerId: Int
    startTrainingDate: String!
    endTrainingDate: String!
    center: String!
    batch: String!
    departments: String!
    yearSem: String!
    strength: Int!
    technology: String!
    labNo: String!
    trainerName: String!
    trainerType: String!
    certification: String!
    trainingStatus: String!
    examinationStatus: String!
    employeeId: String!
    fdpReceived: String!
    fdpTaken: String!
    createdAt: String
    updatedAt: String
  }

  # Input Types for Center Training
  input CreateCenterTrainingInput {
    centerId: Int
    startTrainingDate: String!
    endTrainingDate: String!
    center: String!
    batch: String!
    departments: String!
    yearSem: String!
    strength: Int!
    technology: String!
    labNo: String!
    trainerName: String!
    trainerType: String!
    certification: String!
    trainingStatus: String!
    examinationStatus: String!
    employeeId: String!
    fdpReceived: String!
    fdpTaken: String!
  }

  input UpdateCenterTrainingInput {
    id: ID!
    centerId: Int
    startTrainingDate: String
    endTrainingDate: String
    center: String
    batch: String
    departments: String
    yearSem: String
    strength: Int
    technology: String
    labNo: String
    trainerName: String
    trainerType: String
    certification: String
    trainingStatus: String
    examinationStatus: String
    employeeId: String
    fdpReceived: String
    fdpTaken: String
  }

  input CenterTrainingFilterInput {
    centerId: Int
    center: String
    batch: String
    yearSem: String
    technology: String
    trainerType: String
    trainingStatus: String
  }

  # Extend existing Query type
  extend type Query {
    # Center Training Queries
    centerTrainings: [CenterTraining!]!
    centerTraining(id: ID!): CenterTraining
    centerTrainingsByFilter(filter: CenterTrainingFilterInput): [CenterTraining!]!
    centerTrainingsByCenter(center: String!): [CenterTraining!]!
    centerTrainingsByTechnology(technology: String!): [CenterTraining!]!
  }

  # Extend existing Mutation type
  extend type Mutation {
    # Center Training Mutations
    createCenterTraining(input: CreateCenterTrainingInput!): CenterTraining!
    updateCenterTraining(input: UpdateCenterTrainingInput!): CenterTraining!
    deleteCenterTraining(id: ID!): Boolean!
  }
`;
