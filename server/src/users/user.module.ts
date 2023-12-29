import { Module } from "@nestjs/common";
import { PrismaService } from "src/connection/prisma.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";



@Module({
    imports: [],
    controllers: [UserController],
    providers: [PrismaService, UserService, JwtService],
})

export class UserModule {}