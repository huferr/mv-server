const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./rootTypeDefs');
const { resolvers } = require('./rootResolvers');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => { console.log(`hello world ${url}`)})