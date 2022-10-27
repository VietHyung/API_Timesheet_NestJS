import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';

import { Project } from '../project.entity';

export class CreateProjectDTO {
    @IsString()
    @IsNotEmpty()
    projName: string;

    @IsString()
    @IsNotEmpty()
    instructorId: string;

    @IsString()
    note: string;

    @IsNumber()
    @IsNotEmpty()
    type: number;
}