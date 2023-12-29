import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/connection/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { hashPassword } from "src/auth/helper/hashPassword";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { comparePassword } from "src/auth/helper/comparePassword";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async registerUser(registerDto: RegisterDto) {
        const { username, email, password } = registerDto;

        const userExists = await this.prisma.user.findUnique({
            where: {
                email
            }
        });
        if(userExists) {
            throw new ConflictException('User with this email already exists');
        }
        const has = await hashPassword(password);

        const user = await this.prisma.user.create({
            data: {
                ...registerDto,
                password: has
                
            }
        });

        return user;
    }

    async login(email: string, password: string): Promise<AuthEntity>{
        
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            throw new NotFoundException(`Tidak ada pengguna di temukan untuk email ${email}`)
        }

        const isPasswordValid = await comparePassword(password, user.password)
        
        if (!isPasswordValid) {
            throw new UnauthorizedException(`Kata sandi tidak valid`)
        }
        return {
            ...user,
            accessToken: this.jwtService.sign({
                userId: user.id
            })
        }
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        });

        if(!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async getAllUser() {
        const user = await this.prisma.user.findMany();

        if(!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}