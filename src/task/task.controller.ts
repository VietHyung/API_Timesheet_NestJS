import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, Query, ConflictException, NotFoundException, UseGuards, Req, NotAcceptableException } from '@nestjs/common';
import { UpdateTaskDTO } from './dto/update-task.dto';

import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { CheckAbilities } from '../casl/ability.decorator';
import { Action } from '../casl/ability.factory';
import { Task } from './task.entity';
import { Paging } from 'src/common/response/paging';
import { ResponseData } from 'src/common/response/responseData';

@Controller('tasks')
@UseGuards(AuthenticationGuard)
export class TaskController {
    UserService: any;
    constructor(
        private readonly TaskService: TaskService
    ) { }

    @Post()
    @CheckAbilities({ action: Action.Manage, subject: Task })
    async addTask(@Body() task: CreateTaskDTO) {

        const newTask = await this.TaskService.createOneObj(task);

        return newTask;
    }

    @Get()
    @CheckAbilities({ action: Action.Manage, subject: Task })
    async getAllTask(@Query() pageData: object) {
        const paging = {
            page: pageData['page'] || 1,
            page_size: pageData['page_size'] || 2,
        }
        const tasks = await this.TaskService.getAllObj(paging);
        const [data, total] = tasks;
        const pagingData = new Paging(paging.page, paging.page_size, total)

        return new ResponseData(200, data, 'success', pagingData);
    }

    @Get(':id')
    @CheckAbilities({ action: Action.Manage, subject: Task })
    async getTask(@Param('id') taskId: string) {
        const task = await this.TaskService.GetOneObj(taskId)
        if (!task) {
            throw new NotFoundException('this task doesnt exist!')
        }
        return task;
    }


    @Put(':id')
    @CheckAbilities({ action: Action.Manage, subject: Task })
    async updateTask(
        @Param('id') taskId: string,
        @Body() data: Partial<UpdateTaskDTO>,
    ) {
        const check = this.TaskService.GetOneObj(taskId);
        if (!check) {
            throw new NotFoundException('task not found to update!')
        }
        return await this.TaskService.UpdateOneObj(taskId, data);
    }

    @Delete(':id')
    @CheckAbilities({ action: Action.Manage, subject: Task })
    async delTask(@Param('id') taskId: string) {
        return this.TaskService.removeTask(taskId);
    }
}
