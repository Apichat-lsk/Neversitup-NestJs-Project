import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { IsNumber, IsPhoneNumber } from "class-validator";

export class OrderHistoryDTO {

    userId: string;
    orderId: string;
    productId: string;
    orderNumber: string;
    status: string;

    @IsNotEmpty()
    productCode: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;


}
export class cancelOrderDTO {

    userId: string;
    productId: string;

    @IsNotEmpty()
    @IsString()
    orderNumber: string;

    productCode: string;

    quantity: number;

    amount: number;

    status: string;
}
export class confirmOrderHistoryDTO {


    userId: string;
    orderId: string;
    productId: string;
    status: string;

    @IsNotEmpty()
    @IsString()
    orderNumber: string;

    productCode: string;

    quantity: number;

    amount: number;
}