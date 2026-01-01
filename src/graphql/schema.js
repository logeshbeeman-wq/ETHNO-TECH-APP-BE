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
import { employeeTypeDefs } from './employee.schema.js';
import { employeeResolvers } from '../resolvers/employee.js';
import { scalarTypeDefs } from './scalars.schema.js';
import { scalarResolvers } from '../resolvers/scalars.js';

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
    dashboardStats: DashboardStats!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }

  type BulkUploadResponse {
    success: Boolean!
    message: String
    count: Int
    errors: [String]
  }
`;

// Merge all type definitions
const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  trainingTypeDefs,
  dashboardTypeDefs,
  employeeTypeDefs,
  scalarTypeDefs,
];

// Merge all resolvers
const resolvers = mergeResolvers([
  authResolvers,
  userResolvers,
  trainingResolvers,
  dashboardResolvers,
  employeeResolvers,
  scalarResolvers,
]);

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
