import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, BadRequestException, ConflictException, NotFoundException, UseGuards, NotAcceptableException, Req } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';

import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user-dto';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
@UseGuards(AuthenticationGuard)
export class UserController {

    constructor(private readonly UserService: UserService) { }

    @Post()
    async addUser(@Res() res, @Body() user: CreateUserDTO, @Req() request) {
        const checkUser = await this.UserService.isUser(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only user function!')
        const conflict = await this.UserService.findByName(user.name)
        if (conflict) {
            throw new ConflictException("user already exist");
        }

        const newUser = await this.UserService.createOneObj(user);

        return res.json({
            message: 'User was created successfully!',
            user: newUser,
        })
    }

    //manage task in proj
    @Get('/task/:id')
    async getTaskProject(
        @Param('id') userId: string
    ) {
        const getTask = await this.UserService.getTaskUser(userId);
        return getTask;// không print ra array đc ?
    }

    @Put('/task/:id')
    async addTaskProj(
        @Param('id') userId: string,
        @Body() taskId: Object,
    ) {
        const AddTask = await this.UserService.addTaskToUser(userId, taskId);
        return AddTask;
    }

    @Get()
    async getAllUser() {
        const users = await this.UserService.getAllObj();
        if (!users) {
            throw new NotFoundException('table empty, need to add user!')
        }
        return users;
    }

    @Get(':id')
    async getUser(@Param('id') userId: string) {
        const user = await this.UserService.GetOneObj(userId)
        if (!user) {
            throw new NotFoundException('this user doesnt exist!')
        }
        return user;
    }

    @Put(':id')
    async updateUser(
        @Req() request,
        @Param('id') id: string,
        @Body() data: Partial<UpdateUserDTO>
    ) {

        const checkUser = await this.UserService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only admin function!')
        const check = await this.UserService.GetOneObj(id);
        if (!check) {
            throw new NotFoundException('user not found to update!')
        }
        return await this.UserService.UpdateOneObj(id, data);
    }
}
