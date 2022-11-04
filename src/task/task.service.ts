import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { BaseService } from '../repositories/base/base.service';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService extends BaseService<Task, TaskRepository>{
    constructor(
        @InjectRepository(Task)
        private tasksRepository: TaskRepository,
    ) {
        super(tasksRepository)
    }

    async findByDes(des: string): Promise<Task> {
        let task;
        try {
            task = await this.tasksRepository.findOne({ where: { description: des } })
        } catch (error) {

            throw new NotFoundException('fail to search task!');
        }
        return task;
    }

    async removeTask(taskId: string): Promise<DeleteResult> {

        const delCheck = await this.deleteOneObj(taskId)
        if (delCheck.affected == 0) throw new NotFoundException('task is not found!')
        return delCheck;
    }

    // async searchTaskByName(
    //     taskName: string,
    //     projectName: string
    // ) {
    //     // const task = await this.tasksRepository.findOne({ where: { description: taskName } })
    //     // const proj = await this.projectService.findProjectByName(projectName)
    //     // const projTask = await this.tasksRepository.findOne({ where: { projectId: proj.id } })
    //     // if (!projTask) return task;
    //     // else return projTask;
    // }
}
