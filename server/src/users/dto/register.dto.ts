import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";



export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
    @ApiProperty({ example: 'jhondoe123' })
    username: string;

    @IsEmail()
    @ApiProperty({ example: 'example@gmail.com' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
    @ApiProperty({ example: '@Example123' })
    password: string;
}