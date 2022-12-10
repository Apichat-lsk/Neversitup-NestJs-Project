import { Body, Controller, Post, UseGuards, Req, Delete } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { cancelOrderDTO, OrderDTO } from 'src/dto/order.dto';
import { UserDocument } from 'src/user/user.schema';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Post('/orderProduct')
    @UseGuards(AuthGuard)
    orderProduct(@Req() req: Request, @Body() data: OrderDTO) {
        return this.orderService.orderProduct(req.user as UserDocument, data);
    }

    @Post('/getViewOrderProduct')
    @UseGuards(AuthGuard)
    getViewOrderProduct(@Req() req: Request) {
        return this.orderService.getViewOrderProduct(req.user as UserDocument);
    }

    @Delete('/cancelOrder')
    @UseGuards(AuthGuard)
    cancelOrder(@Req() req: Request, @Body() data: cancelOrderDTO) {
        return this.orderService.cancelOrder(req.user as UserDocument, data);
    }

}
