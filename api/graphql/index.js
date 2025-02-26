const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolvers = {
  Mutation: {
    createUser: (_, { name, email }) => {
      const newUser = { id: Date.now().toString(), name, email };
      pubsub.publish("USER_CREATED", { newUser });
      return newUser;
    }
  },
  Subscription: {
    newUser: {
      subscribe: () => pubsub.asyncIterator(["USER_CREATED"])
    }
  }
};

// Xây dựng một Schema, sử dụng ngôn ngữ Schema GraphQL
const schema = buildSchema(`
  type Query {
    hello: String
    hi: String
    books: [Book]
    findBooks(id: Int): Book
  }

  type Mutation {
    addBook(id: Int, title: String!, author: String!): Book
  }

  type Book {
    id: Int!
    title: String!
    author: String!
  }
`);

// Dữ liệu mẫu
const books = [
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' }
];

// Root cung cấp chức năng phân giải cho mỗi endpoint API
const root = {
    hello: () => {
        return 'Hello world!';
    },
    hi: () => {
        return 'Hi world!';
    },
    books: () => books,
    findBooks: (id) => books.find(book => book.id === id),
    addBook: ({ id, title, author }) => {
        const newBook = { id, title, author };
        books.push(newBook);
        return newBook;
    }
};

// Tạo server với express
var app = express();

// Khai báo API graphql
app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        // context: { user: req.user },
        graphiql: true // sử dụng công cụ GraphiQL để đưa ra các query GraphQL theo cách thủ công
    })
);

// Khởi tạo server tại port 4000
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
