import 'dotenv/config'
import "reflect-metadata";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/resolvers/userResolver";
import { createConnection } from "typeorm";
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { User } from './entities/User';
import { createAccessToken, createRefreshToken } from './utils/auth';

(async () => {
  const app = express();
  app.use(cookieParser())
  app.get("/", (_req, res) => res.send("hello"));

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid

    if (!token) return res.send({ ok: false, accessToken: ""});

    let payload: any;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
    } catch (error) {
      console.log(error)
      return res.send({ ok: false, accessToken: ""})
    }

    // token is valid and we can send back an access token
    const user = await User.findOne({ id: payload.userId })

    if (!user) return res.send({ ok: false, accessToken: ""});

    if (user.tokenVersion !== payload.tokenVersion) return res.send({ ok: false, accessToken: ""})

    res.cookie('jid', createRefreshToken(user), {
      httpOnly: true
    })

    return res.send({ok: true, accessToken: createAccessToken(user)})
  })
    
  await createConnection()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  })

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("express server started")
  })
})()
