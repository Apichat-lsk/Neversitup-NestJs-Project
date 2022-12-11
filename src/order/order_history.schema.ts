import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, ObjectId, SchemaTypes } from 'mongoose';

export type OrderHistoryDocument = OrderHistory & Document;

@Schema({ timestamps: true })
export class OrderHistory {
    // @Prop()
    // _id: string;

    @Prop()
    userId: string;

    @Prop()
    status: string;

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


export const OrderHistorySchema = SchemaFactory.createForClass(OrderHistory);