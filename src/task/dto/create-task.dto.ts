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


export class CreateTaskDTO {
    @IsString()
    @IsNotEmpty()
    description: string;

}