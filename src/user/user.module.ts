import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { TaskModule } from '../task/task.module';
import { JsonWebTokenStrategy } from 'src/auth/strategies/jwt.strategy';
import { CaslModule } from '../casl/casl.module';
import { AbilityFactory } from '../casl/ability.factory';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), TaskModule, CaslModule,
    forwardRef(() => ProjectModule),
  ],
  providers: [UserService, UserRepository, JsonWebTokenStrategy],
  controllers: [UserController],
  exports: [UserService, UserRepository]
})
export class UserModule { }
