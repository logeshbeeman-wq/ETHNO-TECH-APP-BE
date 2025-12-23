// src/schema/typeDefs.js
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    phoneNumber: String
    role: String!
    status: String!
    createdAt: String!
    updatedAt: String
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
    role: String
    status: String
  }

  input UpdateUserInput {
    id: ID!
    username: String
    email: String
    password: String
    phoneNumber: String
    role: String
    status: String
  }

  type Query {
    # User queries
    user(id: ID!): User
    allUsers: [User!]!
    regularUsers: [User!]!
    
    # Add other queries here
  }

  type Mutation {
    # Auth mutations
    register(input: RegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    # User mutations
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    
    # Add other mutations here
  }
`;