import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { IsPhoneNumber } from "class-validator";

// export interface UserDTO {
//     user_id: number;
//     first_name: string;
//     last_name: string;
//     tel: number;
//     username: string;
//     password: string;
//     create_date: Date;
//     update_date: Date;
// }

export class RegisterDTO {

    userId: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber("TH")
    tel: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
export class LoginDTO {

    userId: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber("TH")
    tel: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}