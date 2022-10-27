import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { Timesheet } from './timesheet.entity';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timesheet]), UserModule, ProjectModule, TaskModule
  ],
  controllers: [TimesheetController],
  providers: [TimesheetService]
})
export class TimesheetModule { }
