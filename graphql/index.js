const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Xây dựng một Schema, sử dụng ngôn ngữ Schema GraphQL
// var schema = buildSchema(`
//     type Query {
//       hello: String
//     }
// `);

const schema = buildSchema(`
  type Query {
    hello: String
    books: [Book]
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
  }

  type Book {
    title: String
    author: String
  }
`);

// Dữ liệu mẫu
const books = [
    { title: 'Book 1', author: 'Author 1' },
    { title: 'Book 2', author: 'Author 2' }
];

// Root cung cấp chức năng phân giải cho mỗi endpoint API
const root = {
    hello: () => {
        return 'Hello world!';
    },
    books: () => books,
    addBook: ({ title, author }) => {
        const newBook = { title, author };
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
