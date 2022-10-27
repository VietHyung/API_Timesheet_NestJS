import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';

//import { User } from '../user.entity';

export class CreateClientDTO {
    @IsString()
    clientName: string;

    @IsString()
    address: string;

    @IsNumber()
    phone: number;

}