import { CreateUserDTO } from './create-user.dto';
import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';

import { User } from '../user.entity';

export class UpdateUserDTO {
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    password: string;

    @IsString()
    avatar: string;

    @IsInt()
    @Min(1)
    @Max(3)
    level: number;

}