
import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, ConflictException, NotFoundException, UseGuards, Req, NotAcceptableException } from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/create-client.dto';

@Controller('clients')
@UseGuards(AuthenticationGuard)
export class ClientController {

    constructor(private readonly ClientService: ClientService) { }

    @Post()
    async addClient(@Res() res, @Body() client: CreateClientDTO, @Req() request) {
        const checkUser = await this.ClientService.isUser(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')

        const conflict = await this.ClientService.findByName(client.clientName)
        if (conflict) {
            throw new ConflictException("client already exist");
        }
        const newClient = await this.ClientService.createOneObj(client);
        return res.json({
            message: 'Client was created successfully!',
            Client: newClient,
        })
    }

    @Get()
    async getAllClient() {
        const clients = await this.ClientService.getAllObj();
        if (!clients) {
            throw new NotFoundException('table empty, need to add client!')
        }
        return clients;
    }

    @Get(':id')
    async getClient(@Param('id') clientId: string) {
        const client = this.ClientService.GetOneObj(clientId)
        if (!client) {
            throw new NotFoundException('this client doesnt exist!')
        }
        return client;
    }

    @Put(':id')
    async updateClient(
        @Req() request,
        @Param('id') clientId: string,
        @Body() data: Partial<CreateClientDTO>,
    ) {
        const checkUser = await this.ClientService.isUser(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')
        const check = await this.ClientService.GetOneObj(clientId)
        if (!check) {
            throw new NotFoundException('user not found to update!')
        }
        await this.ClientService.UpdateOneObj(clientId, data);
    }
}
