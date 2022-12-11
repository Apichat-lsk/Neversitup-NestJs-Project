import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductByProductCodeDTO, ProductDTO } from 'src/dto/product.dto';
import { Product } from './product.schema';
import * as moment from 'moment';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel('products') private productModel: Model<Product>,
        private jwtService: JwtService
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

    async getAllProduct() {
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
                _id: 0,
                productName: '$productName',
                productCode: '$productCode',
                productTypeName: '$ProductType.productTypeName',
                price: '$price',
                quantity: '$quantity',
                // createDate: '$createDate',
                // updateDate: '$updateDate',
            }
        }]).exec();
        return this.responseResult(resultData as []);
    }

    async getProductByProductCode(productCode: string) {
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
        return this.responseResult(resultData as []);
    }


}
