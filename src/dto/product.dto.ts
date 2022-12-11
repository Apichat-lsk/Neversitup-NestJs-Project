import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { IsNumber, IsPhoneNumber, isString } from "class-validator";

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
export class ProductByProductCodeDTO {

    @IsNotEmpty()
    @IsString()
    productCode: string;
    productTypeId: string;
    productName: string;
    price: number;
    quantity: number;
}