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

    @Field()
    @Column('text')
      password: string;
      
    @Field()
    @Column('text')
      name: string;

    @Column("int", { default: 0 })
      tokenVersion: number;
}
