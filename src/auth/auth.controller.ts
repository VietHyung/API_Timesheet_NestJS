import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/auth.input';
import { AuthenticationGuard } from './guards/auth.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) { }

    //fucntion register user
    @Post('/register')
    async registerUser(@Body() input: CreateUserDTO) {
        const check = await this.validate(input.email);
        if (!check) {
            throw new HttpException(
                { message: 'User already exists' },
                HttpStatus.BAD_REQUEST,
            );
        }

        input.password = await this.authService.hashPassword(input.password);
        return this.userService.createOneObj(input);
    }

    //handle login
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() request): Promise<any> {
        return this.authService.login(request.user);
    }

    @UseGuards(AuthenticationGuard)
    @Get('current-user')
    async getUserLoggedIn(@Req() request): Promise<User> {
        return this.userService.findOneObj(request.user.id);
    }

    @UseGuards(AuthenticationGuard)
    @Get('profile')
    getProfile(@Req() request) {
        return request.user;
    }

    @UseGuards(AuthenticationGuard)
    @Post('/logout')
    async getUserLogout(@Res() response): Promise<Response> {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        response.clearCookie('access_token');
        response.clearCookie('token');

        return response.sendStatus(200);
    }

    //check user exists by email
    async validate(email: string) {
        try {
            const users = await this.userService.getUserByEmail(email);
            if (!users) return true;
        } catch (e) {
            return false;
        }
    }
}

