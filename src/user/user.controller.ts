import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('/getUser')
    @UseGuards(AuthGuard)
    getAllUser(@Req() req: any) {
        return this.userService.findAll();
    }

    @Get('/getProfile')
    @UseGuards(AuthGuard)
    getProfile(@Req() req: any) {
        return this.userService.getProfile(req);
    }

    @Post('/register')
    registerUser(@Body() data: RegisterDTO) {
        return this.userService.registerUser(data);
    }
}
