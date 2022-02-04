const { mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');

const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './**/*.resolvers.*')))

module.exports = { resolvers };