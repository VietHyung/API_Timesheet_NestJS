import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Client } from './client.entity';
//import { CreateUserDTO } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDTO } from './dto/create-client.dto';
import { UpdateClientDTO } from './dto/update-client.dto';
import { BaseService } from 'src/repositories/base/base.service';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService extends BaseService<Client, ClientRepository>{

    constructor(@InjectRepository(Client)
    private clientsRepository: ClientRepository,) {
        super(clientsRepository)
    };

    async findByName(name: string): Promise<Client> {
        let task;
        try {
            task = await this.clientsRepository.findOne({ where: { clientName: name } })
        } catch (error) {

            throw new NotFoundException('fail to search client!');
        }
        return task;
    }
    // async createClient(input: CreateClientDTO): Promise<Client> {
    //     const newClient = this.clientsRepository.create(input)
    //     if (!input.clientName || !input.address) {
    //         throw new BadRequestException(`A client must have at least name and address`);
    //     }
    //     const conflict = await this.clientsRepository.findOne({ where: { clientName: input.clientName } })
    //     if (conflict) {
    //         throw new ConflictException("client already exist");
    //     }
    //     const saved = await this.clientsRepository.save(newClient);
    //     if (!saved) {
    //         throw new InternalServerErrorException('fail when create client');
    //     }
    //     return saved;
    // }

    // async findClient(cid: any): Promise<Client> {
    //     let client;
    //     try {
    //         client = await this.clientsRepository.findOne({ where: { id: cid } })
    //     } catch (error) {
    //         throw new NotFoundException('fail to search client!');
    //     }
    //     if (!client) {
    //         throw new NotFoundException('could not find client!');
    //     }
    //     return client;
    // }


    // async getClients(): Promise<Client[]> {
    //     const client = await this.clientsRepository.find();
    //     if (!client) {
    //         throw new NotFoundException('table empty, need to add client!')
    //     }
    //     return client;
    // }

    // async getSingleClient(clientId: string): Promise<Client> {
    //     const client = await this.findClient(clientId);
    //     if (!client) {
    //         throw new NotFoundException('table empty, need to add client!')
    //     }
    //     return client;
    // }

    // async updateClient(
    //     clientId: string,
    //     data: Partial<UpdateClientDTO>
    //     //projects: object
    // ): Promise<Client> {
    //     const toUpdate = await this.findClient(clientId);
    //     const updatedClient = Object.assign(toUpdate, data);

    //     return await this.clientsRepository.save({ ...updatedClient });
    // }
}
