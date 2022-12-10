import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    loginUser(@Body() data: LoginDTO) {
        return this.authService.loginUser(data);
    }
}
