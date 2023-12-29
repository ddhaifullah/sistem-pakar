import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";



export class LoginDto {
    @IsEmail()
    @ApiProperty({ example: 'example@gmail.com' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
    @ApiProperty({ example: '@Example123' })
    password: string;
}