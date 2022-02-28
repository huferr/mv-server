import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class UserRegisterInput {
    @Field()
      name: string

    @Field()
      email: string;

    @Field()
      password: string;
}

@InputType()
export class UserLoginInput {

    @Field()
      email: string;

    @Field()
      password: string;
}

@ObjectType()
export class UserAuthResponse {
    @Field()
      accessToken: string
}