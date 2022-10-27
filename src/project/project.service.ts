import { assignMetadata, BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Project } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from 'src/repositories/base/base.service';
import { ProjectRepository } from './project.repository';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Task } from 'src/task/task.entity';
import { TaskService } from '../task/task.service';

@Injectable()
export class ProjectService extends BaseService<Project, ProjectRepository>{
    constructor(@InjectRepository(Project)
    private projectsRepository: ProjectRepository,
        private userService: UserService,
        private taskService: TaskService,
    ) {
        super(projectsRepository)
    };

    async findByName(name: string): Promise<Project> {
        let task;
        try {
            task = await this.projectsRepository.findOne({ where: { projName: name } })
        } catch (error) {

            throw new NotFoundException('fail to search project!');
        }
        return task;
    }

    async createProj(data: any, workerId: any): Promise<Project> {
        var proj = new Project();
        proj.workers = [];
        proj.projName = data.projName;
        proj.instructorId = data.instructorId;
        proj.note = data.note;
        proj.type = data.type;

        for (let i = 0; i < workerId.length; i++) {
            var human = await this.userService.findOneObj(workerId[i])
            proj.workers.push(human);
        }

        const saved = await this.projectsRepository.save(proj);
        return saved;
    }

    //find project that contain worker on it
    async findProjWorker(projectId: string): Promise<Project> {
        const getWker = await this.projectsRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.workers', 'user')
            .where(`project.id = ${projectId}`)
            .getOne()

        return getWker;
    }

    async addWorkerToProj(projectId: string, wkerId: Object): Promise<Project> {
        const getWker = await this.findProjWorker(projectId);

        var toStr = wkerId["workerId"]
        for (let i = 0; i < toStr.length; i++) {
            var human = await this.userService.findOneObj(toStr[i]);
            getWker.workers.push(human);
        }

        const updated = await this.projectsRepository.save(getWker);
        return updated;
    }

    async delWorkerFromProj(projectId: string, wkerId: Object): Promise<Project> {
        const getWker = await this.findProjWorker(projectId);

        var toStr = wkerId["workerId"]
        for (let i = 0; i < toStr.length; i++) {
            var found = getWker.workers.findIndex(f => f.id == toStr[i])
            getWker.workers.splice(found, 1)
        }

        const deleted = await this.projectsRepository.save(getWker);
        return deleted;
    }

    async getWorkerProj(projectId: string): Promise<User[]> {
        const getWker = await this.findProjWorker(projectId);
        return getWker.workers;
    }

    //find project that contain task on it
    async findProjTask(projectId: string): Promise<Project> {
        const getWker = await this.projectsRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.tasks', 'task')
            .where(`project.id = ${projectId}`)
            .getOne()

        return getWker;
    }

    async getTaskProj(projectId: string): Promise<Task[]> {
        const getTask = await this.findProjTask(projectId);
        console.log(getTask)
        return getTask.tasks;
    }

    async addTaskToProj(projectId: string, tksId: Object): Promise<Project> {
        const getTask = await this.findProjTask(projectId);
        var toStr = tksId["taskId"]
        for (let i = 0; i < toStr.length; i++) {
            var tks = await this.taskService.findOneObj(toStr[i]);
            getTask.tasks.push(tks);
        }

        const added = await this.projectsRepository.save(getTask);
        return added;
    }

    async delTkFromProj(projectId: string, tksId: Object): Promise<Project> {
        const getTask = await this.findProjTask(projectId);

        var toStr = tksId["taskId"]
        for (let i = 0; i < toStr.length; i++) {
            var found = getTask.tasks.findIndex(f => f.id == toStr[i])
            getTask.tasks.splice(found, 1)
        }

        const deleted = await this.projectsRepository.save(getTask);
        return deleted;
    }

    async findProjectByName(projName: string): Promise<Project> {
        let project;
        try {
            project = await this.projectsRepository.findOne({ where: { projName: projName } })
        } catch (error) {
            throw new NotFoundException('fail to search project!');
        }
        return project;
    }
}
