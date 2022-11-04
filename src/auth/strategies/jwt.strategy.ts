import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
//import { JWT_SECRET_KEY } from 'src/config/jwt.config';
import { AuthPayload } from '../interfaces/auth-payload.interface';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
    }

    async validate(payload: AuthPayload) {
        return { name: payload.name, email: payload.email, level: payload.level, id: payload.id };
    }
}
