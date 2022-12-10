import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class User {
    @ObjectIdColumn()
    _id?: ObjectId;
    @Column()
    first_name: String;
    @Column()
    last_name: String;
    @Column()
    tel: Number;
    @Column()
    username: String;
    @Column()
    password: String;
    @Column()
    create_date: Date;
    @Column()
    update_date: Date;
}