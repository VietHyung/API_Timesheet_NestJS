import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { Timesheet } from './timesheet.entity';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { CaslModule } from '../casl/casl.module';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timesheet]), UserModule, ProjectModule, TaskModule, CaslModule,
    forwardRef(() => UserModule),
  ],
  controllers: [TimesheetController],
  providers: [TimesheetService]
})
export class TimesheetModule { }
