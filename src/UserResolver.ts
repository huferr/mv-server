import { Resolver, Query, Mutation, Arg, ObjectType, Field } from "type-graphql";
import { User } from "./entity/User";
import { compare, hash } from 'bcryptjs'
import { sign } from "jsonwebtoken";

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
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email }})

        if (!user) throw new Error("could not find user");

        const validatePassword = await compare(password, user.password);

        if (!validatePassword) throw new Error("wrong password");

        return {
            accessToken: sign({ userId: user.id }, 'secret', { expiresIn: "15m" })
        };
       
    }
}