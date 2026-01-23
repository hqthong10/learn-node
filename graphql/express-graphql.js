const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const { graphqlHTTP } = require('express-graphql');
const connectDB = require("./config/db");
const { PubSub } = require("graphql-subscriptions");
const schema = require('./schema/schema.js');
const { schemaDemo, rootDemo } = require('./schema/schema-demo.js');

// Tạo server với express
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Kết nối MongoDB
connectDB();

// const pubsub = new PubSub();

// const resolvers = {
//   Mutation: {
//     createUser: (_, { name, email }) => {
//       const newUser = { id: Date.now().toString(), name, email };
//       pubsub.publish("USER_CREATED", { newUser });
//       return newUser;
//     }
//   },
//   Subscription: {
//     newUser: {
//       subscribe: () => pubsub.asyncIterator(["USER_CREATED"])
//     }
//   }
// };

// Khai báo API graphql
app.use(
    '/graphql',
    graphqlHTTP({
        schema: schemaDemo,
        rootValue: rootDemo,
        // context: { user: req.user },
        graphiql: true // sử dụng công cụ GraphiQL để đưa ra các query GraphQL theo cách thủ công
    })
);

// Khai báo API graphql
// app.use(
//     '/graphql',
//     graphqlHTTP({
//         schema: schema,
//         graphiql: true
//     })
// );

// Khởi tạo server tại port 4000
app.listen(4000, () => console.log('Running a GraphQL API server at http://localhost:4000/graphql'));
