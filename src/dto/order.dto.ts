import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { IsNumber, IsPhoneNumber } from "class-validator";

export class OrderDTO {

    userId: string;
    productId: string;
    orderNumber: string;

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
}