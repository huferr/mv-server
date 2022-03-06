import { verify } from "jsonwebtoken";
import { ContextType } from "src/typing";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<ContextType> = ({ context },  next) => {
  const authorization = context.req.headers['authorization']

  if(!authorization) throw new Error("not authenticated");

  try {
    const token = authorization.split(" ")[1]
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as ContextType['payload'];
  } catch (error) {
    console.log(error);
    throw new Error("not authenticated");
  }
  return next()
};