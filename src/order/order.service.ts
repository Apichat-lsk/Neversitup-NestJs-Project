import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderDTO } from 'src/dto/order.dto';
import { Product, ProductDocument } from 'src/product/product.schema';
import { OrderDocument } from 'src/user/interfaces/order.interface';
import { User, UserDocument } from 'src/user/user.schema';
import { Order } from './order.schema';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel('order') private orderModel: Model<Order>,
        @InjectModel('product') private productModel: Model<Product>,
        @InjectModel('users') private userModel: Model<User>,
    ) {

    }

    makeid(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result.toUpperCase();
    }

    async getProfile(data: any) {
        const resultData = await this.userModel.findOne({ username: data.user.username }).exec();
        return resultData;
    }
    async getProductByProductCode(productCode: string): Promise<ProductDocument[]> {
        const resultData = await this.productModel.aggregate([
            {
                $match: {
                    $and: [{ productCode: productCode }]
                }
            },
            {
                $lookup: {
                    from: 'product_type',
                    let: { productTypeId: '$productTypeId' },
                    pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$_id', '$$productTypeId'] }] } } }, { $project: { productTypeName: '$productTypeName' } }],
                    as: 'ProductType'
                }
            },
            {
                $unwind: { path: '$ProductType' }
            },
            {
                $project: {
                    productName: '$productName',
                    productCode: '$productCode',
                    productTypeName: '$ProductType.productTypeName',
                    price: '$price',
                    quantity: '$quantity',
                    createDate: '$createDate',
                    updateDate: '$updateDate',
                }
            }]).exec();
        return resultData;
    }
    async getViewOrderProduct(user: UserDocument) {
        const resultData = await this.orderModel.aggregate([
            {
                $match: {
                    $and: [{ userId: user.userId }]
                }
            },
            {
                $lookup: {
                    from: 'product',
                    let: { productId: '$productId' },
                    pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$_id', '$$productId'] }] } } }, { $project: { productTypeId: '$productTypeId', productName: '$productName' } }],
                    as: 'Product'
                }
            },
            {
                $unwind: { path: '$Product' }
            },
            {
                $lookup: {
                    from: 'product_type',
                    let: { productTypeId: '$Product.productTypeId' },
                    pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$_id', '$$productTypeId'] }] } } }, { $project: { productTypeName: '$productTypeName' } }],
                    as: 'ProductType'
                }
            },
            {
                $unwind: { path: '$ProductType' }
            },
            {
                $project: {
                    userId: '$userId',
                    productTypeName: '$ProductType.productTypeName',
                    productName: '$Product.productName',
                    date: '$date',
                    quantity: '$quantity',
                    amount: '$amount',
                    orderNumber: '$orderNumber'
                }
            }]).exec();
        return resultData;
    }
    async orderProduct(user: UserDocument, data: OrderDTO) {
        try {
            const resultCheckProduct = await this.getProductByProductCode(data.productCode);
            if (!resultCheckProduct.length) throw new HttpException("PRODUCT_NOT_FOUND", HttpStatus.BAD_REQUEST);
            const resultCountData = await this.orderModel.aggregate([
                {
                    $match: {
                        $and: [{ productId: new Types.ObjectId(resultCheckProduct[0]?._id) }]
                    }
                },
                {
                    $group: {
                        _id: '$productId',
                        cnt: { $sum: '$quantity' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        cnt: '$cnt'
                    }
                }
            ]).exec();
            if (resultCountData[0]?.cnt >= resultCheckProduct[0]?.quantity) throw new HttpException("PRODUCT_OUT_OF_STOCK", HttpStatus.BAD_REQUEST);
            const quantityProduct = resultCheckProduct[0]?.quantity - (resultCountData[0]?.cnt || 0);
            if (quantityProduct < data.quantity) throw new HttpException("NOT_ENOUGH_PRODUCT", HttpStatus.BAD_REQUEST);
            const jsonData: any = {
                userId: user.userId,
                productId: new Types.ObjectId(resultCheckProduct[0]?._id),
                quantity: data.quantity,
                amount: data.amount * data.quantity,
                orderNumber: `TH-${this.makeid(10)}`
            };
            const resultData = await new this.orderModel(jsonData).save();
            if (!resultData) throw new HttpException("ORDER_PRODUCT_FAILED", HttpStatus.BAD_REQUEST);
            return {
                statusCode: 200,
                message: "ORDER_PRODUCT_SUCCESS"
            };
        } catch (error) {
            throw error;
        }
    }
    async cancelOrder(user: UserDocument, data: OrderDTO) {
        try {
            const resultData = await this.orderModel.deleteOne({ $and: [{ userId: user.userId }, { orderNumber: data.orderNumber }] }).exec();
            if (!resultData) throw new HttpException("CANCEL_ORDER_FAILED", HttpStatus.BAD_REQUEST);
            return {
                statusCode: 200,
                message: "CANCEL_ORDER_SUCCESS"
            };
        } catch (error) {
            throw error;
        }
    }


}
