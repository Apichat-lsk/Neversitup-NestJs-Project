import { Body, Controller, Post, UseGuards, Req, Delete, Patch } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { cancelOrderDTO, confirmOrderDTO, OrderDTO } from 'src/dto/order.dto';
import { confirmOrderHistoryDTO } from 'src/dto/order_history.dto';
import { UserDocument } from 'src/user/user.schema';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Post('/createOrderProduct')
    @UseGuards(AuthGuard)
    createOrderProduct(@Req() req: Request, @Body() data: OrderDTO) {
        return this.orderService.createOrderProduct(req.user as UserDocument, data);
    }

    @Post('/getViewOrderProduct')
    @UseGuards(AuthGuard)
    getViewOrderProduct(@Req() req: Request) {
        return this.orderService.getViewOrderProduct(req.user as UserDocument);
    }

    @Post('/getViewOrderHistory')
    @UseGuards(AuthGuard)
    getViewOrderHistory(@Req() req: Request) {
        return this.orderService.getViewOrderHistory(req.user as UserDocument);
    }

    @Patch('/cancelOrder')
    @UseGuards(AuthGuard)
    cancelOrder(@Req() req: Request, @Body() data: cancelOrderDTO) {
        return this.orderService.cancelOrder(req.user as UserDocument, data);
    }

    @Patch('/confirmOrder')
    @UseGuards(AuthGuard)
    confirmOrder(@Req() req: Request, @Body() data: confirmOrderHistoryDTO) {
        return this.orderService.confirmOrder(req.user as UserDocument, data);
    }

}
