import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, BadRequestException, ConflictException, NotFoundException, UseGuards, NotAcceptableException, Req, Query } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';

import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user-dto';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { AbilitiesGuard } from '../casl/ability.guard';
import { CheckAbilities } from '../casl/ability.decorator';
import { Action } from '../casl/ability.factory';
import { User } from './user.entity';
import { Task } from '../task/task.entity';
import { ResponseData } from '../common/response/responseData';
import { Paging } from '../common/response/paging';

@Controller('users')
@UseGuards(AuthenticationGuard, AbilitiesGuard)
export class UserController {

    constructor(private readonly UserService: UserService) { }

    //simple query
    @Post()
    @CheckAbilities({ action: Action.Create, subject: User })
    async addUser(@Body() user: CreateUserDTO) {
        const conflict = await this.UserService.findByName(user.name)
        if (conflict) {
            throw new ConflictException("user already exist");
        }

        const newUser = await this.UserService.createOneObj(user);

        return newUser;
    }

    @Get()
    @CheckAbilities({ action: Action.Read, subject: User })
    async getAllUser(@Query() pageData: object) {
        const paging = {
            page: pageData['page'] || 1,
            page_size: pageData['page_size'] || 2,
        }

        const users = await this.UserService.getAllObj(paging);
        const [data, total] = users;
        const pagingData = new Paging(paging.page, paging.page_size, total)

        return new ResponseData(200, data, 'success', pagingData);
    }

    @Get(':id')
    @CheckAbilities({ action: Action.Read, subject: User })
    async getUser(@Param('id') userId: string) {
        const user = await this.UserService.GetOneObj(userId)
        if (!user) {
            throw new NotFoundException('this user doesnt exist!')
        }
        return user;
    }

    @Put(':id')
    @CheckAbilities({ action: Action.Update, subject: User })
    async updateUser(
        @Param('id') id: string,
        @Body() data: Partial<UpdateUserDTO>
    ) {
        const check = await this.UserService.GetOneObj(id);
        if (!check) {
            throw new NotFoundException('user not found to update!')
        }
        return await this.UserService.UpdateOneObj(id, data);
    }

    //manage task in proj
    @Get('/task/:id')
    @CheckAbilities({ action: Action.Manage, subject: Task })
    async getTaskProject(
        @Param('id') userId: string
    ) {
        const getTask = await this.UserService.getTaskUser(userId);
        return getTask;
    }

    @Put('/task/:id')
    @CheckAbilities({ action: Action.Manage, subject: Task })
    async addTaskProj(
        @Param('id') userId: string,
        @Body() taskId: Object,
    ) {
        const AddTask = await this.UserService.addTaskToUser(userId, taskId);
        return AddTask;
    }
}
