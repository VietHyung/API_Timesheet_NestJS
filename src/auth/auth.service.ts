import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthPayload } from './interfaces/auth-payload.interface';
import * as moment from 'moment';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    //function hash password
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    //function compare password param with user password in database
    async comparePassword(
        password: string,
        storePasswordHash: string,
    ): Promise<any> {
        return await bcrypt.compare(password, storePasswordHash);
    }

    async authentication(email: string, password: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        const check = await this.comparePassword(password, user.password);

        if (!user || !check) {
            return false;
        }

        return user;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    async login(user: User) {
        const payload: AuthPayload = {
            name: user.name,
            email: user.email,
            id: user.id,
        };
        const expiresTime = 100;

        return {
            expiresIn: moment().add(expiresTime, 'days'),
            token: this.jwtService.sign(payload),
            user,
        };
    }
}
