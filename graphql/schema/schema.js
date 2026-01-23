const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const W100 = require('../models/w100');

// Định nghĩa W100Type
const W100Type = new GraphQLObjectType({
    name: 'W100',
    fields: () => ({
        PW100: { type: GraphQLInt },
        WV101: { type: GraphQLString },
        WV102: { type: GraphQLString }
    })
});

// Query: Lấy danh sách sách
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        w100s: {
            type: new GraphQLList(W100Type),
            resolve(parent, args) {
                return W100.find();
            }
        }
    }
});

// Mutation: Thêm sách mới
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addW100: {
            type: W100Type,
            args: {
                WV101: { type: GraphQLString },
                WV102: { type: GraphQLString },
            },
            async resolve(parent, args) {
                const w100 = new W100({
                    WV101: args.WV101,
                    WV102: args.WV102
                });
                return await w100.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
