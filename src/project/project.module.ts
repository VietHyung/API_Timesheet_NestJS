import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';
import { UserModule } from '../user/user.module';
import { TaskModule } from '../task/task.module';
import { CaslModule } from '../casl/casl.module';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]), TaskModule, CaslModule,
    forwardRef(() => TaskModule),
    forwardRef(() => UserModule),
    forwardRef(() => ClientModule),
  ],
  providers: [ProjectService, ProjectRepository],
  controllers: [ProjectController],
  exports: [ProjectService]
})
export class ProjectModule { }
