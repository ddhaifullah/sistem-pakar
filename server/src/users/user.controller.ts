import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserEntity } from "./entities/user.entity";


@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
    constructor(
        private readonly userService: UserService
        ) {}
        
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('myprofile/:id')
    @ApiOkResponse({ type: UserEntity })
    async findOne(@Param('id') id: string) {
        return new UserEntity(await this.userService.findOne(id));
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserEntity, isArray: true  })
    @Get()
    async getAllUser() {
        const users = await this.userService.getAllUser();
        return users.map(user => new UserEntity(user));
    }
}