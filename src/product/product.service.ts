import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel('product') private productModel: Model<Product>,
        private jwtService: JwtService
    ) {
    }

    async getAllProduct(): Promise<Product[]> {
        const resultData = await this.productModel.aggregate([{
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

    async getProductByProductCode(productCode: string): Promise<Product[]> {
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


}
