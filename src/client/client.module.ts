import { forwardRef, Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ClientRepository } from './client.repository';
import { CaslModule } from '../casl/casl.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]), CaslModule,
    forwardRef(() => ProjectModule)
  ],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController]
})
export class ClientModule { }
