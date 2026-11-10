import 'dotenv/config';
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { connectDatabase } from './config/database.js';
import { schema } from './graphql/schema.js';
import { root } from './graphql/resolvers.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.all(
  '/graphql',
  createHandler({
    schema,
    rootValue: root,
  }),
);

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});