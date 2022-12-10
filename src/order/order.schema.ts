import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, ObjectId, SchemaTypes } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    // @Prop()
    // _id: string;

    @Prop()
    userId: string;

    @Prop()
    orderNumber: string;

    @Prop({ type: SchemaTypes.ObjectId })
    productId: ObjectId;

    @Prop()
    quantity: number;

    @Prop()
    amount: number;

    @Prop({ default: Date.now })
    date: Date;

    @Prop({ default: Date.now })
    createDate: Date;

    @Prop({ default: Date.now })
    updateDate: Date;

}


export const OrderSchema = SchemaFactory.createForClass(Order);