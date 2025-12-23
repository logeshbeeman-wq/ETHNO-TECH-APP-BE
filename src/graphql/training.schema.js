// src/graphql/training.schema.js
import { gql } from 'graphql-tag';

export const trainingTypeDefs = gql`
  # Center Training Type (Tab 1)
  type CenterTraining {
    id: ID!
    startTrainingDate: String!
    endTrainingDate: String!
    center: String!
    strength: Int!
    technology: String!
    trainerName: String!
    trainerType: String!
    certification: String!
    trainingStatus: String!
    examinationStatus: String!
    employeeId: String!
    fdp: String!
    createdAt: String
    updatedAt: String
  }

  # Batch Training Type (Tab 2)
  type BatchTraining {
    id: ID!
    startTrainingDate: String!
    endTrainingDate: String!
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
    fdp: String!
    createdAt: String
    updatedAt: String
  }

  # Input Types for Center Training
  input CreateCenterTrainingInput {
    startTrainingDate: String!
    endTrainingDate: String!
    center: String!
    strength: Int!
    technology: String!
    trainerName: String!
    trainerType: String!
    certification: String!
    trainingStatus: String!
    examinationStatus: String!
    employeeId: String!
    fdp: String!
  }

  input UpdateCenterTrainingInput {
    id: ID!
    startTrainingDate: String
    endTrainingDate: String
    center: String
    strength: Int
    technology: String
    trainerName: String
    trainerType: String
    certification: String
    trainingStatus: String
    examinationStatus: String
    employeeId: String
    fdp: String
  }

  # Input Types for Batch Training
  input CreateBatchTrainingInput {
    startTrainingDate: String!
    endTrainingDate: String!
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
    fdp: String!
  }

  input UpdateBatchTrainingInput {
    id: ID!
    startTrainingDate: String
    endTrainingDate: String
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
    fdp: String
  }

  # Extend existing Query type
  extend type Query {
    # Center Training Queries
    centerTrainings: [CenterTraining!]!
    centerTraining(id: ID!): CenterTraining
    centerTrainingsByCenter(center: String!): [CenterTraining!]!
    centerTrainingsByTechnology(technology: String!): [CenterTraining!]!

    # Batch Training Queries
    batchTrainings: [BatchTraining!]!
    batchTraining(id: ID!): BatchTraining
    batchTrainingsByBatch(batch: String!): [BatchTraining!]!
    batchTrainingsByDepartment(department: String!): [BatchTraining!]!
    batchTrainingsByTechnology(technology: String!): [BatchTraining!]!
  }

  # Extend existing Mutation type
  extend type Mutation {
    # Center Training Mutations
    createCenterTraining(input: CreateCenterTrainingInput!): CenterTraining!
    updateCenterTraining(input: UpdateCenterTrainingInput!): CenterTraining!
    deleteCenterTraining(id: ID!): Boolean!

    # Batch Training Mutations
    createBatchTraining(input: CreateBatchTrainingInput!): BatchTraining!
    updateBatchTraining(input: UpdateBatchTrainingInput!): BatchTraining!
    deleteBatchTraining(id: ID!): Boolean!
  }
`;
