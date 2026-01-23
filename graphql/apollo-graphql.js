const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");


// Tạo server với express
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Kết nối MongoDB
connectDB();

// Tạo Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Middleware cho GraphQL
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/graphql`));
}

startServer();
