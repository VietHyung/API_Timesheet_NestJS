
import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, ConflictException, NotFoundException, UseGuards, Req, NotAcceptableException, Query } from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { CheckAbilities } from 'src/casl/ability.decorator';
import { Action } from 'src/casl/ability.factory';
import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/create-client.dto';
import { Client } from './client.entity';
import { Paging } from 'src/common/response/paging';
import { ResponseData } from 'src/common/response/responseData';

@Controller('clients')
@UseGuards(AuthenticationGuard)
export class ClientController {

    constructor(private readonly ClientService: ClientService) { }

    @Post()
    @CheckAbilities({ action: Action.Manage, subject: Client })
    async addClient(@Body() client: CreateClientDTO) {
        const conflict = await this.ClientService.findByName(client.clientName)
        if (conflict) {
            throw new ConflictException("client already exist");
        }
        const newClient = await this.ClientService.createOneObj(client);
        return newClient;
    }

    @Get()
    @CheckAbilities({ action: Action.Manage, subject: Client })
    async getAllClient(@Query() pageData: object) {
        const paging = {
            page: pageData['page'] || 1,
            page_size: pageData['page_size'] || 2,
        }
        const clients = await this.ClientService.getAllObj(paging);
        const [data, total] = clients;
        const pagingData = new Paging(paging.page, paging.page_size, total)

        return new ResponseData(200, data, 'success', pagingData);
    }

    @Get(':id')
    @CheckAbilities({ action: Action.Manage, subject: Client })
    async getClient(@Param('id') clientId: string) {
        const client = this.ClientService.GetOneObj(clientId)
        if (!client) {
            throw new NotFoundException('this client doesnt exist!')
        }
        return client;
    }

    @Put(':id')
    @CheckAbilities({ action: Action.Manage, subject: Client })
    async updateClient(
        @Param('id') clientId: string,
        @Body() data: Partial<CreateClientDTO>,
    ) {
        const check = await this.ClientService.GetOneObj(clientId)
        if (!check) {
            throw new NotFoundException('user not found to update!')
        }
        await this.ClientService.UpdateOneObj(clientId, data);
    }
}
