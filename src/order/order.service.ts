import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderDTO } from 'src/dto/order.dto';
import { Product, ProductDocument } from 'src/product/product.schema';
import { OrderDocument } from 'src/user/interfaces/order.interface';
import { User, UserDocument } from 'src/user/user.schema';
import { OrderHistory } from './order_history.schema';
import { Order } from './order.schema';
import * as moment from 'moment';
import { OrderHistoryDTO } from 'src/dto/order_history.dto';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel('orders') private orderModel: Model<Order>,
        @InjectModel('order_histories') private orderHistoryModel: Model<OrderHistory>,
        @InjectModel('products') private productModel: Model<Product>,
        @InjectModel('users') private userModel: Model<User>,
    ) {

    }

    responseResult(data: []) {
        if (data.length) {
            return {
                status: new HttpException("SUCCESS", HttpStatus.OK).getStatus(),
                message: new HttpException("SUCCESS", HttpStatus.OK).message,
                result: data
            };
        } else {
            return {
                status: new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND).getStatus(),
                message: new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND).message,
                result: data
            };
        }
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
        resultData.map((val) => {
            val.createDate = moment(val.createDate).format('DD/MM/YYYY HH:mm:ss')
            val.updateDate = moment(val.updateDate).format('DD/MM/YYYY HH:mm:ss')
        })
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
                    from: 'products',
                    let: { productId: '$productId' },
                    pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$_id', '$$productId'] }] } } }, { $project: { productTypeId: '$productTypeId', productName: '$productName', productCode: '$productCode' } }],
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
                $lookup: {
                    from: 'order_status',
                    let: { status: '$status' },
                    pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$value', '$$status'] }] } } }, { $project: { description: '$description' } }],
                    as: 'status'
                }
            },
            {
                $unwind: { path: '$status' }
            },
            {
                $project: {
                    _id: 0,
                    userId: '$userId',
                    productTypeName: '$ProductType.productTypeName',
                    productName: '$Product.productName',
                    productCode: '$Product.productCode',
                    date: '$date',
                    quantity: '$quantity',
                    amount: '$amount',
                    orderNumber: '$orderNumber',
                    status: '$status.description'
                }
            }
        ]).exec();
        resultData.map((val) => {
            val.date = moment(val.date).format('DD/MM/YYYY HH:mm:ss')
        })
        return this.responseResult(resultData as []);
    }
    async getViewOrderHistory(user: UserDocument) {
        const resultData = await this.orderHistoryModel.aggregate([
            {
                $match: {
                    $and: [{ userId: user.userId }]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    let: { productId: '$productId' },
                    pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$_id', '$$productId'] }] } } }, { $project: { productTypeId: '$productTypeId', productName: '$productName', productCode: '$productCode' } }],
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
                $lookup: {
                    from: 'order_status',
                    let: { status: '$status' },
                    pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$value', '$$status'] }] } } }, { $project: { description: '$description' } }],
                    as: 'status'
                }
            },
            {
                $unwind: { path: '$status' }
            },
            {
                $project: {
                    _id: 0,
                    userId: '$userId',
                    productTypeName: '$ProductType.productTypeName',
                    productName: '$Product.productName',
                    productCode: '$Product.productCode',
                    date: '$date',
                    quantity: '$quantity',
                    amount: '$amount',
                    orderNumber: '$orderNumber',
                    status: '$status.description'
                }
            }
        ]).exec();
        resultData.map((val) => {
            val.date = moment(val.date).format('DD/MM/YYYY HH:mm:ss')
        })
        return this.responseResult(resultData as []);
    }
    async createOrderProduct(user: UserDocument, data: OrderDTO) {
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
                orderNumber: `TH-${this.makeid(10)}`,
                status: "000"
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
            // const resultData = await this.orderModel.deleteOne({ $and: [{ userId: user.userId }, { orderNumber: data.orderNumber }] }).exec();
            const resultUpdate = await this.orderModel.updateOne({ $and: [{ userId: user.userId }, { orderNumber: data.orderNumber }, { status: '000' }] }, { $set: { status: "002" } }).exec();
            if (resultUpdate.matchedCount <= 0) throw new HttpException("CANCEL_ORDER_FAILED", HttpStatus.BAD_REQUEST);
            const orderProduct = await this.orderModel.findOne({ $and: [{ userId: user.userId }, { orderNumber: data.orderNumber }, { status: "002" }] }).exec();
            const jsonData: any = {
                userId: user.userId,
                orderId: orderProduct._id,
                productId: orderProduct.productId,
                quantity: orderProduct.quantity,
                amount: orderProduct.amount,
                orderNumber: orderProduct.orderNumber,
                status: orderProduct.status
            };
            const resultData = await new this.orderHistoryModel(jsonData).save();
            if (!resultData) throw new HttpException("CANCEL_ORDER_FAILED", HttpStatus.BAD_REQUEST);
            return {
                statusCode: 200,
                message: "CANCEL_ORDER_SUCCESS"
            };
        } catch (error) {
            throw error;
        }
    }

    async confirmOrder(user: UserDocument, data: OrderHistoryDTO) {
        try {
            const resultUpdate = await this.orderModel.updateOne({ $and: [{ userId: user.userId }, { orderNumber: data.orderNumber }, { status: "000" }] }, { $set: { status: "001" } }).exec();
            if (resultUpdate.matchedCount <= 0) throw new HttpException("CONFIRM_ORDER_FAILED", HttpStatus.BAD_REQUEST);
            const orderProduct = await this.orderModel.findOne({ $and: [{ userId: user.userId }, { orderNumber: data.orderNumber }, { status: "001" }] }).exec();
            const jsonData: any = {
                userId: user.userId,
                orderId: orderProduct._id,
                productId: orderProduct.productId,
                quantity: orderProduct.quantity,
                amount: orderProduct.amount,
                orderNumber: orderProduct.orderNumber,
                status: orderProduct.status
            };
            const resultData = await new this.orderHistoryModel(jsonData).save();
            if (!resultData) throw new HttpException("CONFIRM_ORDER_FAILED", HttpStatus.BAD_REQUEST);
            return {
                statusCode: 200,
                message: "CONFIRM_ORDER_SUCCESS"
            };
        } catch (error) {
            throw error;
        }
    }


}
