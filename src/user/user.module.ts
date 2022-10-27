import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { TaskModule } from '../task/task.module';
import { JsonWebTokenStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), TaskModule
  ],
  providers: [UserService, UserRepository, JsonWebTokenStrategy],
  controllers: [UserController],
  exports: [UserService, UserRepository]
})
export class UserModule { }
