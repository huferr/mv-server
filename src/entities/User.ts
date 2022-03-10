import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
      id: number;
    
    @Column('text')
      email: string;

    @Column('text')
      password: string;

    @Column('text')
      name: string;

    @Column('int', { default: 0 })
      mathscore: number;

    @Column("int", { default: 0 })
      tokenVersion: number;

    @Column('text')
      imageUri: string;
}
