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

    async findAll(): Promise<User[]> {
        return this.userModel.find({}).exec();
    }

    async getProfile(data: any) {
        const resultData = await this.userModel.findOne({ username: data.user.username }).exec();
        return resultData;
    }

    async registerUser(user: UserDocument): Promise<User> {
        try {
            const saltOrRounds = 10;
            const password = user.password;
            const hash = await bcrypt.hash(password, saltOrRounds);
            const jsonData: UserDocument = {
                userId: id,
                firstName: user.firstName,
                lastName: user.lastName,
                tel: user.tel,
                username: user.username,
                password: hash,
            };
            const resultData = await new this.userModel(jsonData).save();
            return resultData;
        } catch (error) {
            throw new HttpException("USERNAME_IS_ALREADY", HttpStatus.BAD_REQUEST);
        }
    }

}
