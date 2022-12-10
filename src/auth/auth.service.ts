import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('users') private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    // async validateUser(username: string, pass: string): Promise<any> {
    //     const user = await this.usersService.loginUser(username);
    //     if (user && user.password === pass) {
    //         const { password, ...result } = user;
    //         return result;
    //     }
    //     return null;
    // }
    async loginUser(data: LoginDTO) {
        const resultData = await this.userModel.findOne({ username: data.username }).exec();
        if (!resultData) throw new HttpException("USERNAME_NOT_FOUND", HttpStatus.BAD_REQUEST);
        const isMatch = await bcrypt.compare(data.password, resultData.password);
        if (!isMatch) throw new HttpException("USERNAME_OR_PASSWORD_INCORRECT", HttpStatus.BAD_REQUEST);
        const resultToken = this.generateToken(resultData);
        return resultToken;
    }
    async generateToken(user: any) {
        const payload = { userId: user.userId, username: user.username, firstName: user.firstName, lastName: user.lastName, sub: user.userId };
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}