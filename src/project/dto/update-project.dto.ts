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

export class UpdateProjectDTO {
    @IsString()
    projName: string;

    @IsString()
    instructor: string;

    @IsNumber()
    workday: number;

    @IsNumber()
    type: number;
}