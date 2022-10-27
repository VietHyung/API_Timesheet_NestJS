import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ClientRepository } from './client.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
  ],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController]
})
export class ClientModule { }
