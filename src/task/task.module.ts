import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from '../task/task.entity';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { TaskRepository } from './task.repository';
import { UserService } from '../user/user.service';
import { CaslModule } from '../casl/casl.module';
import { TimesheetModule } from '../timesheet/timesheet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), CaslModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService]
})
export class TaskModule { }
