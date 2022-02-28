import { verify } from "jsonwebtoken";
import { Context } from "src/typing";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<Context> = ({ context },  next) => {
  const authorization = context.req.headers['authorization']

  if(!authorization) throw new Error("not authenticated");

  try {
    const token = authorization.split(" ")[1]
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as Context['payload'];
  } catch (error) {
    console.log(error);
    throw new Error("not authenticated");
  }
  return next()
};