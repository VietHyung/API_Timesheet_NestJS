import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from 'src/task/task.entity';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { TaskRepository } from './task.repository';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task])
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService]
})
export class TaskModule { }
