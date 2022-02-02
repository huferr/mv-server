const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    nickname: String!
    mathscore: Int!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
  }
`;

module.exports = { typeDefs };