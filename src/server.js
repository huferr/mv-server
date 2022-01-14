import express from "express";
import { graphqlHTTP } from "express-graphql";
import { graphql } from "graphql";
const app = express();
const PORT = 3030;

const schema = {};

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log('hello world')
})