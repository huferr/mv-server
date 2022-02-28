import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../../entities/User";
import { compare, hash } from 'bcryptjs'
import { Context } from "../../context";
import { createAccessToken, createRefreshToken } from "../../auth";
import { UserAuthResponse, UserLoginInput, UserRegisterInput } from "../schemas/userSchema";

@Resolver()
export class UserResolver {
    @Query(() => [User])
    users() {
        return User.find();
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('userRegisterInput') userRegisterInput: UserRegisterInput
    ) {
        const hashedPassword = await hash(userRegisterInput.password, 12);

        try {
          await User.insert({
            name: userRegisterInput.name,
            email: userRegisterInput.email,
            password: hashedPassword,
          })
        } catch (error) {
          console.log(error)
          return false
        }

        return true;
       
    }

    @Mutation(() => UserAuthResponse)
    async login(
        @Arg('userLoginInput') userloginInput: UserLoginInput, 
        @Ctx() { res }: Context
    ): Promise<UserAuthResponse> {
        const user = await User.findOne({ where: { email: userloginInput.email }})

        if (!user) throw new Error("could not find user");

        const validatePassword = await compare(userloginInput.password, user.password);

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