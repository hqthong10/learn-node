const W100 = require("../models/w100");

const resolvers = {
  Query: {
    getW100s: async () => await W100.find(),
    getW100: async (_, { id }) => await W100.findById(id),
  },
  Mutation: {
    createW100: async (_, { name, email, age }) => {
      const user = new W100({ name, email, age });
      await user.save();
      return user;
    },
    deleteW100: async (_, { id }) => {
      await W100.findByIdAndDelete(id);
      return "User deleted!";
    },
  },
};

module.exports = resolvers;