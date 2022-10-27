import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';

export class UpdateTaskDTO {
    @IsString()
    @IsNotEmpty()
    description: string;


}