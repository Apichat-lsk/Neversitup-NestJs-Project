import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    // @Prop()
    // _id: string;

    @Prop()
    userId: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    tel: string;

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop({ default: Date.now })
    createDate: Date;

    @Prop({ default: Date.now })
    updateDate: Date;

}


export const UserSchema = SchemaFactory.createForClass(User);