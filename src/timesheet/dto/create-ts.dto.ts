import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';
import { Project } from 'src/project/project.entity';
import { User } from 'src/user/user.entity';

//import { User } from '../user.entity';
import { Task } from '../../task/task.entity';

export class CreateTimeSheetDTO {

    @IsString()
    note: string;

    @IsNumber()
    workingTime: number;

    @IsString()
    status: string;

    @IsString()
    type: string;


}