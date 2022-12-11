import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './interfaces/user.interface';
import { User } from './user.schema';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

const id: string = uuid().replace(/-/g, '');


@Injectable()
export class UserService {


    constructor(
        @InjectModel('users') private userModel: Model<User>,
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

    async findAll(): Promise<User[]> {
        return this.userModel.find({}).exec();
    }

    async getProfile(data: any) {
        try {
            const resultData = await this.userModel.aggregate([
                {
                    $match: {
                        $and: [{ username: data.user.username }]
                    }
                },
                {
                    $project: {
                        _id: 0,
                        firstName: '$firstName',
                        lastName: '$lastName',
                        tel: '$tel',
                    }
                }
            ]).exec();
            return this.responseResult(resultData as []);
        } catch (error) {
            throw new HttpException("INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async registerUser(user: UserDocument) {
        try {
            const saltOrRounds = 10;
            const password = user.password;
            const hash = await bcrypt.hash(password, saltOrRounds);
            const jsonData = {
                userId: id,
                firstName: user.firstName,
                lastName: user.lastName,
                tel: user.tel,
                username: user.username,
                password: hash,
            };
            await new this.userModel(jsonData).save();
            const data = [{ ...jsonData }]
            delete data[0]?.username;
            delete data[0]?.password;
            return this.responseResult(data as []);
        } catch (error) {
            throw new HttpException("USERNAME_IS_ALREADY", HttpStatus.BAD_REQUEST);
        }
    }

}
