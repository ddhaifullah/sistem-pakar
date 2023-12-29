import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersService: UserService) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JwtSecretToken,
        });
    }

    async validate(payload: { userId: string }) {
        const user = await this.usersService.findOne(payload.userId);

        if (!user) {
        throw new UnauthorizedException();
        }

        return user;
    }
}