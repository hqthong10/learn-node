import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { connectDB } from './db.js';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { buildContext } from './context.js';

await connectDB();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use('/graphql', cors(), express.json(), expressMiddleware(server, { context: buildContext }));

app.listen(4000, () => console.log('🚀 http://localhost:4000/graphql'));