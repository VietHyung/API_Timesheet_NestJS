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
import { Task } from 'src/task/task.entity';
import { User } from 'src/user/user.entity';

//import { User } from '../user.entity';

export class UpdateTimeSheetDTO {

    @IsString()
    note: string;

    @IsNumber()
    workingTime: number;

    @IsString()
    status: string;

    @IsString()
    type: string;

}