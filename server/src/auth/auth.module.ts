import { Module } from "@nestjs/common";
import { UserService } from "src/users/user.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/connection/prisma.service";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategy/jwt.strategy";


@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JwtSecretToken,
            signOptions: { 
                expiresIn: '1d'
            },
        })
    ],
    controllers: [AuthController],
    providers: [UserService, PrismaService, JwtStrategy],
})

export class AuthModule {}