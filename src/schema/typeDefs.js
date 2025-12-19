import { gql } from 'graphql-tag';

export const typeDefs = gql`
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
    users: [User!]! @auth(requires: ADMIN)
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }

  directive @auth(requires: Role = USER) on FIELD_DEFINITION

  enum Role {
    USER
    ADMIN
  }
`;
