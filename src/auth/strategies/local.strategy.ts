import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/user/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
        //đăng nhập bằng email và password, custom usernameField
    }

    async validate(email: string, password: string): Promise<User> {
        const user = await this.authService.authentication(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}

