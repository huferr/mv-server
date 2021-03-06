import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, Int } from "type-graphql";
import { User } from "../../entities/User";
import { compare, hash } from 'bcryptjs'
import { ContextType } from "../../typing";
import { createAccessToken, createRefreshToken } from "../../utils/auth";
import { MathscoreRank, UserAuthResponse, UserData, UserLoginInput, UserRegisterInput } from "../schemas/userSchema";
import { isAuth } from "../../middlewares/isAuth";
import { getConnection } from "typeorm";

@Resolver()
export class UserResolver {
  @Mutation(() => UserAuthResponse)
  async register(
    @Arg('UserRegisterInput') userRegisterInput: UserRegisterInput
  ) {
    const userName = userRegisterInput.name;
    const userEmail = userRegisterInput.email;
    const userPassword = userRegisterInput.password;
    const emailRegEx = /@[a-zA-Z]+\.+[a-z-A-Z]+/;

    if(!userName || userName === "" ) throw new Error("NAME_CANNOT_BE_EMPTY");
    if(userName.length < 4) throw new Error("NAME_TOO_SHORT");


    if(!userEmail|| userEmail === "" ) throw new Error("EMAIL_CANNOT_BE_EMPTY");
    if(!emailRegEx.test(userEmail)) throw new Error("INVALID_EMAIL");

    if(!userPassword || userPassword === "" ) throw new Error("PASSWORD_CANNOT_BE_EMPTY");
    if(userPassword.length < 6) throw new Error("PASSWORD_TOO_SHORT");

    const hashedPassword = await hash(userPassword, 12);
    const emailAlreadyExists = await User.findOne({ where: { email: userEmail }});
    const nameAlreadyExists = await User.findOne({ where: { name: userName }});

    if (emailAlreadyExists) throw new Error('EMAIL_ALREADY_EXISTS');

    if (nameAlreadyExists) throw new Error('NAME_ALREADY_EXISTS');

    try {
      await User.insert({
        name: userName,
        email: userEmail,
        password: hashedPassword,
        imageUri: "empty",
      })
    } catch (error) {
      return false
    }

    const user = await User.findOne({ where: { email: userEmail }})

    if (!user) throw new Error("UNKNOWN_ERROR");

    return {
      accessToken: createAccessToken(user)
    };
  }

  @Mutation(() => UserAuthResponse)
  async login(
    @Arg('UserLoginInput') userloginInput: UserLoginInput, 
    @Ctx() { res }: ContextType
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
    @Ctx() { payload }: ContextType
  ) {

    return User.findOne({ where: { id: payload?.userId }})
  }

  @Query(() => [MathscoreRank])
  @UseMiddleware(isAuth)
  async mathscoreRank(
    @Ctx() { payload }: ContextType
  ) {
    if(!payload) throw new Error("NOT_AUTH");

    const users = (await User.find({ order:{ mathscore: "DESC" }, select: ["mathscore", "name"]}))
      .map((user, index) => ({
        name: user.name,
        position: 1 + index,
        mathscore: user.mathscore,
      }))

    return users;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async uploadUserImage(
    @Arg('imageUri', () => String) imageUri: string,
    @Ctx() { payload }: ContextType
  ) {
    if(imageUri === null) throw new Error("INVALID_URI");

    try {
      await getConnection()
        .createQueryBuilder()
        .update(User).set({ imageUri }).where({ id: payload?.userId })
        .execute();
    } catch (error) {
      throw new Error(error);
    }

    return true
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateNickname(
    @Arg('nickname', () => String) nickname: string,
    @Ctx() { payload }: ContextType
  ) {

    if(nickname === "") throw new Error("NICKNAME_CANNOT_BE_EMPTY");
    if(nickname.length > 12) throw new Error("NICKNAME_TOO_LARGE");
    if(nickname.length < 4) throw new Error("NICKNAME_TOO_SHORT");

    const nicknameAlreadyExists = await User.findOne({ where: { name: nickname } })

    if(nicknameAlreadyExists) throw new Error("NAME_ALREADY_EXISTS")

    try {
      await getConnection()
        .createQueryBuilder()
        .update(User).set({ name: nickname }).where({ id: payload?.userId })
        .execute();
    } catch (error) {
      throw new Error(error);
    }

    return true
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateEmail(
    @Arg('email', () => String) email: string,
    @Ctx() { payload }: ContextType
  ) {
    const emailRegEx = /@[a-zA-Z]+\.+[a-z-A-Z]+/;

    if(email === "") throw new Error("EMAIL_CANNOT_BE_EMPTY");

    if(!emailRegEx.test(email)) throw new Error("INVALID_EMAIL");

    const emailAlreadyExists = await User.findOne({ where: { email } })

    if(emailAlreadyExists) throw new Error("EMAIL_ALREADY_EXISTS")

    try {
      await getConnection()
        .createQueryBuilder()
        .update(User).set({ email }).where({ id: payload?.userId })
        .execute();
    } catch (error) {
      throw new Error(error);
    }

    return true
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addMathscore(
    @Arg('amount', () => Int) amount: number,
    @Ctx() { payload }: ContextType
  ) {
    
    try {
      await getConnection()
        .getRepository(User)
        .increment({id: Number(payload?.userId)}, "mathscore", amount)
    } catch (error) {
      throw new Error(error);
    }

    return true
  }
}