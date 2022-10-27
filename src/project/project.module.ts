import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';
import { UserModule } from '../user/user.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]), UserModule, TaskModule
  ],
  providers: [ProjectService, ProjectRepository],
  controllers: [ProjectController],
  exports: [ProjectService]
})
export class ProjectModule { }
