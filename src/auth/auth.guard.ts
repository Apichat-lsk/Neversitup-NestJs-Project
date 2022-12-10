import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization?.replace(/^bearer /i, '');
            if (!token) throw new HttpException('UNAUTHORIZED', HttpStatus.BAD_REQUEST);
            const verifyToken = this.jwtService.verify(token)
            return request.user = verifyToken;
        } catch (error) {
            throw new HttpException("TOKEN_EXPIRED", HttpStatus.BAD_REQUEST);
        }
    };
}