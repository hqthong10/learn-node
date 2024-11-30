const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Xây dựng một Schema, sử dụng ngôn ngữ Schema GraphQL
var schema = buildSchema(`
    type Query {
      hello: String
    }
`);


// Root cung cấp chức năng phân giải cho mỗi endpoint API
var root = {
    hello: () => {
      return 'Hello world!';
    },
};
  
// Tạo server với express
var app = express();
  
// Khai báo API graphql
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // sử dụng công cụ GraphiQL để đưa ra các query GraphQL theo cách thủ công
}));
  
// Khởi tạo server tại port 4000
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
