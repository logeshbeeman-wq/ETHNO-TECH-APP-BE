// src/graphql/schema.js
import { gql } from 'graphql-tag';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';
import { authResolvers } from '../resolvers/auth.js';
import { userResolvers } from '../resolvers/user.js';
import { trainingResolvers } from '../resolvers/training.js';
import { userTypeDefs } from './user.schema.js';
import { trainingTypeDefs } from './training.schema.js';

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
    allUsers: [User!]!
    regularUsers: [User!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;

// Merge all type definitions by combining them into an array
const typeDefs = [baseTypeDefs, userTypeDefs, trainingTypeDefs];

// Merge all resolvers
const resolvers = mergeResolvers([
  {
    Query: {
      ...authResolvers.Query,
    },
    Mutation: {
      ...authResolvers.Mutation,
    },
  },
  userResolvers,
  trainingResolvers,
]);

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});