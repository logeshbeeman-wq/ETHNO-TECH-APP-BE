// src/graphql/schema.js
import { gql } from 'graphql-tag';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authResolvers } from '../resolvers/auth.js';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
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
    role: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
    users: [User!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`;

const resolvers = {
  Query: {
    ...authResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
};

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});