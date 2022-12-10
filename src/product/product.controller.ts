import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) { }

    @Get('/getAllProduct')
    @UseGuards(AuthGuard)
    getAllUser(@Req() req: any) {
        return this.productService.getAllProduct();
    }

    @Get('/getProductByProductCode')
    @UseGuards(AuthGuard)
    getProductByProductCode(@Query() paramQuery: any) {
        return this.productService.getProductByProductCode(paramQuery.productCode);
    }

}
