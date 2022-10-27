import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';

export class ApproveTimeSheetDTO {

    @IsString()
    projectId: string;

    @IsString()
    userId: string;


}