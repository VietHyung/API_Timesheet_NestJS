import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntity, Between, Repository } from 'typeorm';
import { BaseService } from '../repositories/base/base.service';
import { UserRepository } from './user.repository';
import { TaskService } from '../task/task.service';
import { Task } from 'src/task/task.entity';
import { Timesheet } from 'src/timesheet/timesheet.entity';
import { startOfDay } from 'date-fns';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
    constructor(@InjectRepository(User)
    private usersRepository: UserRepository,
        private taskService: TaskService
    ) {
        super(usersRepository)
    };

    async getUserByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { email: email } });
    }

    async findUserTask(userId: string): Promise<User> {
        const getWker = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.tasks', 'task')
            .where(`user.id = ${userId}`)
            .getOne()

        return getWker;
    }

    async getTaskUser(userId: string): Promise<Task[]> {
        const getTask = await this.findUserTask(userId);
        return getTask.tasks;
    }

    async addTaskToUser(userId: string, tksId: Object): Promise<User> {
        const getTask = await this.findUserTask(userId);
        var toStr = tksId["taskId"]
        for (let i = 0; i < toStr.length; i++) {
            var tks = await this.taskService.findOneObj(toStr[i]);
            getTask.tasks.push(tks);
        }

        const added = await this.usersRepository.save(getTask);
        return added;
    }

    async findByName(name: string): Promise<User> {
        let task;
        try {
            task = await this.usersRepository.findOne({ where: { name: name } })
        } catch (error) {

            throw new NotFoundException('fail to search user!');
        }
        return task;
    }

    async findUserTimesheet(creatorId: string, start: Date, end: Date): Promise<User> {
        const getCreator = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.timesheets', 'timesheet')
            .where(`user.id = ${creatorId}`)
            .where(`user.timesheets.createdAt BETWEEN '${start.toISOString()}' AND ${end.toISOString()}`)
            .getOne()

        console.log(getCreator)

        // getCreator.timesheets.forEach(element => {
        //     console.log(element)
        // });

        // const timesheet = await this.usersRepository.find({
        //     relations: { timesheets: true },
        //     where: {
        //         id: creatorId,
        //         //['createdAt']: Between(start, end),
        //     }
        // });
        // console.log(timesheet)
        return;
    }
}
