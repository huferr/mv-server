import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { User } from "../../entities/User";
import { compare, hash } from 'bcryptjs'
import { Context } from "../../typing";
import { createAccessToken, createRefreshToken } from "../../auth";
import { UserAuthResponse, UserLoginInput, UserRegisterInput } from "../schemas/userSchema";
import { isAuth } from "../../middlewares/isAuth";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  // query accessible only if user is authenticated 
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(
    @Ctx() { payload }: Context
  ) {
    return `your user id is: ${payload?.userId}`;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('UserRegisterInput') userRegisterInput: UserRegisterInput
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
    @Arg('UserLoginInput') userloginInput: UserLoginInput, 
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