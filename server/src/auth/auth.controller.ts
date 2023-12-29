import { Body, Controller, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { RegisterDto } from "src/users/dto/register.dto";
import { UserService } from "src/users/user.service";
import { UserEntity } from "src/users/entities/user.entity";
import { AuthEntity } from "./entities/auth.entity";
import { LoginDto } from "src/users/dto/login.dto";


@Controller('auth')
@ApiTags('auth (register, login)')
export class AuthController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post('register')
    @ApiCreatedResponse({ type: UserEntity })
    async register(@Body() registerDto: RegisterDto) {
        return new UserEntity(await this.userService.registerUser(registerDto));
    }

    @Post('login')
    @ApiCreatedResponse({ type: AuthEntity })
    async login(@Body() {email, password} : LoginDto) {
        return new AuthEntity(await this.userService.login(email, password));
    }
    
}