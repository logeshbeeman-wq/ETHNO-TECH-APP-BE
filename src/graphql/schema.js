// src/graphql/schema.js
import { gql } from 'graphql-tag';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';
import { authResolvers } from '../resolvers/auth.js';
import { userResolvers } from '../resolvers/user.js';
import { trainingResolvers } from '../resolvers/training.js';
import { userTypeDefs } from './user.schema.js';
import { trainingTypeDefs } from './training.schema.js';
import { typeDefs as dashboardTypeDefs } from './dashboard/schema.js';
import { resolvers as dashboardResolvers } from './dashboard/resolvers.js';

const baseTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    status: String!
    phoneNumber: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    phoneNumber: String!
    role: String!
    status: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    centerTrainings: [CenterTraining!]!
    centerTraining(id: ID!): CenterTraining
    batchTrainings: [BatchTraining!]!
    batchTraining(id: ID!): BatchTraining
    dashboardStats: DashboardStats!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    
    # Center Training Mutations
    createCenterTraining(input: CenterTrainingInput!): CenterTraining!
    updateCenterTraining(id: ID!, input: CenterTrainingInput!): CenterTraining!
    deleteCenterTraining(id: ID!): Boolean!
    
    # Batch Training Mutations
    createBatchTraining(input: BatchTrainingInput!): BatchTraining!
    updateBatchTraining(id: ID!, input: BatchTrainingInput!): BatchTraining!
    deleteBatchTraining(id: ID!): Boolean!
  }
`;

// Merge all type definitions by combining them into an array
const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  trainingTypeDefs,
  dashboardTypeDefs,
];

// Merge all resolvers
const resolvers = mergeResolvers([
  authResolvers,
  userResolvers,
  trainingResolvers,
  dashboardResolvers,
]);

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});