import { Book } from '../models/Book.js';

export const resolvers = {
  Query: {
    books: () => Book.find().sort({ createdAt: -1 }),
    book: (_, { id }) => Book.findById(id),
  },
  Mutation: {
    createBook: (_, { input }) => Book.create(input),
    deleteBook: async (_, { id }) => {
      const res = await Book.deleteOne({ _id: id });
      return res.deletedCount === 1;
    },
  },
  Book: {
    // Mongoose có getter `id` (= _id dạng string) nên không cần resolver cho id
    createdAt: (book) => book.createdAt.toISOString(),
  },
};