import { Document } from 'mongoose';

export interface UserDocument {

    readonly userId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly tel: string;
    readonly username: string;
    readonly password: string;

}