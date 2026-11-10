import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type Task {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(
      title: String!
      description: String
    ): Task!

    updateTask(
      id: ID!
      title: String
      description: String
      completed: Boolean
    ): Task

    deleteTask(id: ID!): Boolean!
  }
`);