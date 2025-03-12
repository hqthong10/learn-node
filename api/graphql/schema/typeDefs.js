const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type W100 {
    _id: ID!
    PW100: Int!
    WV101: String!
    WV102: String!
  }

  type Query {
    getW100s: [W100]
    getW100(id: ID!): W100
  }

  type Mutation {
    createW100(name: String!, email: String!, age: Int): W100
    deleteW100(id: ID!): String
  }
`;

module.exports = typeDefs;