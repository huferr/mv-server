const { mergeTypeDefs } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');

const typeDefs = mergeTypeDefs(loadFilesSync(path.resolve('./**/*.gql')))

module.exports = { typeDefs };