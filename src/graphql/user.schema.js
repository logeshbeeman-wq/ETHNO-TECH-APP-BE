// src/graphql/user.schema.js
import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  extend type Query {
    # Get a single user by ID
    user(id: ID!): User
    getUser(id: ID!): User
    
    # Get all users (admin only)
    allUsers: [User!]!
    
    # Get all non-superadmin users
    regularUsers: [User!]!
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

  extend type Mutation {
    # Update user details
    updateUser(input: UpdateUserInput!): User!
    
    # Delete a user (admin only)
    deleteUser(id: ID!): Boolean!
  }

`;