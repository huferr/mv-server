import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx } from "type-graphql";
import { User } from "./entity/User";
import { compare, hash } from 'bcryptjs'
import { Context } from "./context";
import { createAccessToken, createRefreshToken } from "./auth";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    users() {
        return User.find();
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Arg('name') name: string,
    ) {
        const hashedPassword = await hash(password, 12);

        try {
          await User.insert({
            name,
            email,
            password: hashedPassword,
          })
        } catch (error) {
          console.log(error)
          return false
        }

        return true;
       
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { res }: Context
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email }})

        if (!user) throw new Error("could not find user");

        const validatePassword = await compare(password, user.password);

        if (!validatePassword) throw new Error("wrong password");

        // login successful

        res.cookie('jid', createRefreshToken(user), {
            httpOnly: true
        })

        return {
            accessToken: createAccessToken(user)
        };
       
    }
}