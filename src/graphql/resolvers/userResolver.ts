import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, Int } from "type-graphql";
import { User } from "../../entities/User";
import { compare, hash } from 'bcryptjs'
import { Context } from "../../typing";
import { createAccessToken, createRefreshToken } from "../../auth";
import { UserAuthResponse, UserData, UserLoginInput, UserRegisterInput } from "../schemas/userSchema";
import { isAuth } from "../../middlewares/isAuth";
import { getConnection } from "typeorm";

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

  @Mutation(() => UserAuthResponse)
  async register(
    @Arg('UserRegisterInput') userRegisterInput: UserRegisterInput
  ) {
    const hashedPassword = await hash(userRegisterInput.password, 12);
    const emailAlreadyExists = await User.findOne({ where: { email: userRegisterInput.email }});
    const nameAlreadyExists = await User.findOne({ where: { name: userRegisterInput.name }});

    if (emailAlreadyExists) throw new Error('EMAIL_ALREADY_EXISTS');

    if (nameAlreadyExists) throw new Error('NAME_ALREADY_EXISTS');

    try {
      await User.insert({
        name: userRegisterInput.name,
        email: userRegisterInput.email,
        password: hashedPassword,
      })
    } catch (error) {
      return false
    }

    const user = await User.findOne({ where: { email: userRegisterInput.email }})

    if (!user) throw new Error("UNKNOWN_ERROR");

    return {
      accessToken: createAccessToken(user)
    };
  }

  @Mutation(() => UserAuthResponse)
  async login(
    @Arg('UserLoginInput') userloginInput: UserLoginInput, 
    @Ctx() { res }: Context
  ): Promise<UserAuthResponse> {
    const user = await User.findOne({ where: { email: userloginInput.email }})

    if (!user) throw new Error("WRONG_EMAIL");

    const validatePassword = await compare(userloginInput.password, user.password);

    if (!validatePassword) throw new Error("WRONG_PASSWORD");

    // login successful

    res.cookie('jid', createRefreshToken(user), {
      httpOnly: true
    })

    return {
      accessToken: createAccessToken(user)
    };
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg('userId', () => Int) userId: number
  ) {
    await getConnection().getRepository(User).increment({id: userId}, "tokenVersion", 1)

    return true
  }

  @Query(() => UserData)
  @UseMiddleware(isAuth)
  user(
    @Ctx() { payload }: Context
  ) {
    return User.findOne({ where: { id: payload?.userId }})
  }
}