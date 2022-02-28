import { Field, Int, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
      id: number;
    
    @Field()
    @Column('text')
      email: string;

    @Column('text')
      password: string;

    @Column('text')
      name: string;

    @Column("int", { default: 0 })
      tokenVersion: number;
}
