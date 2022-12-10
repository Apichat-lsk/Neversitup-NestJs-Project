import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { IsNumber, IsPhoneNumber } from "class-validator";

export class ProductDTO {

    productTypeId: string;

    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}