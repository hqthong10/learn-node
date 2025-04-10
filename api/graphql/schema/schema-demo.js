const { buildSchema } = require('graphql');

// Dữ liệu mẫu
const books = [
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' }
];

const schemaDemo = buildSchema(`
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

// Root cung cấp chức năng phân giải cho mỗi endpoint API
const rootDemo = {
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

module.exports = { schemaDemo, rootDemo };
