import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, BaseEntity } from 'typeorm';
import { CreateTimeSheetDTO } from './dto/create-ts.dto';
import { UpdateTimeSheetDTO } from './dto/update-ts.dto';
import { Timesheet } from './timesheet.entity';
import { UserService } from '../user/user.service';
import { ProjectService } from 'src/project/project.service';
import { TaskService } from '../task/task.service';
import { endOfDay, startOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { ApproveTimeSheetDTO } from './dto/approve-ts.dto';
import { BaseService } from 'src/repositories/base/base.service';
import { TimesheetRepository } from './timesheet.repository';

@Injectable()
export class TimesheetService extends BaseService<Timesheet, TimesheetRepository>{
    constructor(@InjectRepository(Timesheet)
    private timesheetsRepository: TimesheetRepository,
        private userService: UserService,
        private projectService: ProjectService,
        private taskService: TaskService,
    ) {
        super(timesheetsRepository)
    };

    async createTimesheet(
        input: CreateTimeSheetDTO,
        creatorId: string,
        projectId: string,
        taskId: string
    ): Promise<Timesheet> {
        const newTS = new Timesheet();
        newTS.note = input.note;
        newTS.workingTime = input.workingTime;
        newTS.type = input.type;
        newTS.status = input.status;
        const getUser = this.userService.GetOneObj(creatorId);
        const getProject = this.projectService.GetOneObj(projectId);
        const getTask = this.taskService.GetOneObj(taskId);

        newTS.creator = await getUser;
        newTS.project = await getProject;
        newTS.task = await getTask;

        const saved = await this.timesheetsRepository.save(newTS);
        return saved;
    }

    async findTimesheet(tsid: any): Promise<Timesheet> {
        let ts;
        try {
            ts = await this.timesheetsRepository.findOne({ where: { id: tsid } })
        } catch (error) {
            throw new NotFoundException('fail to search user!');
        }
        if (!ts) {
            throw new NotFoundException('user dont exists!')
        }
        return ts;
    }

    async getTimesheets(): Promise<Timesheet[]> {
        const ts = await this.timesheetsRepository.find();
        if (!ts) {
            throw new NotFoundException('table empty, need to add user!')
        }
        return ts;
    }

    async getSingleTimesheet(tsId: string): Promise<Timesheet> {
        const ts = await this.findTimesheet(tsId);
        if (!ts) {
            throw new NotFoundException('table empty, need to add ts!')
        }
        return ts;
    }

    async updateTimesheet(
        id: string,
        data: UpdateTimeSheetDTO,
        creatorId: string,
        projectId: string,
        taskId: string
    ): Promise<Timesheet> {
        const toUpdate = await this.findTimesheet(id);
        const updatedTS = Object.assign(toUpdate, data);

        const getUser = this.userService.GetOneObj(creatorId);
        const getProject = this.projectService.GetOneObj(projectId);
        const getTask = this.taskService.GetOneObj(taskId);

        updatedTS.creator = await getUser;
        updatedTS.project = await getProject;
        updatedTS.task = await getTask;

        return await this.timesheetsRepository.save({
            ...updatedTS,
            // creator: getUser,
            // project: getProject,
            // task: getTask
        });
    }

    async getMyTimesheetByDay(creatorId: string): Promise<Timesheet[]> {
        const _date = new Date();
        const start = startOfDay(_date)
        const end = endOfDay(_date)
        const ts = await this.timesheetsRepository.find({
            where: {
                creatorId: creatorId,
                createdAt: Between(start, end),
            }
        });
        return ts;

    }

    async getMyTimesheetByWeek(creatorId: string): Promise<Timesheet[]> {
        const _date = new Date();
        const start = startOfWeek(_date)
        const end = endOfWeek(_date)
        const ts = await this.timesheetsRepository.find({
            where: {
                creatorId: creatorId,
                createdAt: Between(start, end),
            }
        });
        return ts;
    }

    async getMyTimesheetByProject(projectId: string): Promise<Timesheet[]> {
        const ts = await this.timesheetsRepository.find({
            where: {
                projectId: projectId
            }
        });
        return ts;
    }

    async getTSByPeople(userId: string): Promise<Timesheet[]> {
        const ts = await this.timesheetsRepository.find({
            where: {
                creatorId: userId
            }
        });
        return ts;
    }

    async getAllTSByWeek(): Promise<Timesheet[]> {
        const _date = new Date();
        const start = startOfWeek(_date)
        const end = endOfWeek(_date)
        const ts = await this.timesheetsRepository.find({
            where: {
                createdAt: Between(start, end),
            }
        });
        return ts;
    }

    async submitMyTimesheetByWeek(creatorId: string): Promise<Timesheet[]> {
        const _date = new Date();
        const start = startOfWeek(_date)
        const end = endOfWeek(_date)
        const ts = await this.timesheetsRepository.find({
            where: {
                creatorId: creatorId,
                createdAt: Between(start, end),
            }
        });
        ts.forEach(el => {
            el.status = 'Pending'
        })
        this.timesheetsRepository.save(ts)
        return ts;
    }

    async approveTSByWeek(data: ApproveTimeSheetDTO): Promise<Timesheet[]> {
        const _date = new Date();
        const start = startOfWeek(_date)
        const end = endOfWeek(_date)
        const ts = await this.timesheetsRepository.find({
            where: {
                createdAt: Between(start, end),
                projectId: data.projectId,
                creatorId: data.userId,
                status: 'Pending'
            }
        });
        ts.forEach(el => {
            el.status = 'Approved'
        })
        this.timesheetsRepository.save(ts)
        //console.log(ts)
        return ts;
    }

    async getAllPendingTS(): Promise<Timesheet[]> {
        const ts = await this.timesheetsRepository.find({
            where: {
                status: 'Pending'
            }
        });
        return ts;
    }
}
