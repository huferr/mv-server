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

@ObjectType()
export class UserData {
  @Field()
    name: string;

  @Field()
    email: string;

  @Field()
    imageUri: string;
  
  @Field()
    mathscore: number;
}

@ObjectType()
export class MathscoreRank {
  @Field()
    name: string;

  @Field()
    position: number;

  @Field()
    mathscore: number;
}

@ObjectType()
export class UserImageUploadInput {

  @Field()
    imageUri: string;

}

@ObjectType()
export class UserImageUploadResponse {

  @Field()
    status: boolean;
}