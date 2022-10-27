import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, Query, ConflictException, NotFoundException, UseGuards, Req, NotAcceptableException } from '@nestjs/common';
import { UpdateTaskDTO } from './dto/update-task.dto';

import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';

@Controller('tasks')
@UseGuards(AuthenticationGuard)
export class TaskController {
    UserService: any;
    constructor(
        private readonly TaskService: TaskService
    ) { }

    @Post()
    async addTask(@Res() res, @Body() task: CreateTaskDTO, @Req() request) {
        const checkUser = await this.UserService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')

        const newTask = await this.TaskService.createOneObj(task);

        return res.json({
            message: 'Task was created successfully!',
            task: newTask,
        })
    }

    @Get()
    async getAllTask() {
        const tasks = await this.TaskService.getAllObj();
        if (!tasks) {
            throw new NotFoundException('table empty, need to add task!')
        }
        return tasks;
    }

    @Get(':id')
    async getTask(@Param('id') taskId: string) {
        const task = await this.TaskService.GetOneObj(taskId)
        if (!task) {
            throw new NotFoundException('this task doesnt exist!')
        }
        return task;
    }


    @Put(':id')
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
    async delTask(@Param('id') taskId: string, @Req() request) {
        const checkUser = await this.UserService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')
        return this.TaskService.removeTask(taskId);
    }
}
