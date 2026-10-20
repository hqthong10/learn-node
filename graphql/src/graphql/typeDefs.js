export const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
    createdAt: String!
  }

  input CreateBookInput {
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    createBook(input: CreateBookInput!): Book!
    deleteBook(id: ID!): Boolean!
  }
`;