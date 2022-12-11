import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/order/order.schema';
import { ProductSchema } from 'src/product/product.schema';
import { UserSchema } from 'src/user/user.schema';

@Module({
    imports: [MongooseModule.forRoot('mongodb://localhost:27017/neversitup'), MongooseModule.forFeature([{ name: 'users', schema: UserSchema }, { name: 'products', schema: ProductSchema }, { name: 'orders', schema: OrderSchema }, { name: 'order_histories', schema: OrderSchema }])],
    exports: [MongooseModule],
})
export class DatabaseModule { }