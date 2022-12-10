import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    // @Prop()
    // _id: string;

    @Prop()
    productTypeId: string;

    @Prop()
    productName: string;

    @Prop()
    price: number;

    @Prop()
    quantity: number;

    @Prop({ default: Date.now })
    createDate: Date;

    @Prop({ default: Date.now })
    updateDate: Date;

}


export const ProductSchema = SchemaFactory.createForClass(Product);