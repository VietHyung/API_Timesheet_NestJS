import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, ConflictException, NotFoundException, UseGuards, Req, NotAcceptableException, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { Action } from 'src/casl/ability.factory';
import { CheckAbilities } from 'src/casl/ability.decorator';
import { Project } from './project.entity';
import { User } from 'src/user/user.entity';
import { AbilitiesGuard } from '../casl/ability.guard';
import { Paging } from 'src/common/response/paging';
import { ResponseData } from 'src/common/response/responseData';

@Controller('projects')
@UseGuards(AuthenticationGuard, AbilitiesGuard)
export class ProjectController {
    constructor(private readonly ProjectService: ProjectService) { }

    @Post()
    @CheckAbilities({ action: Action.Manage, subject: Project })
    async addProject(@Body() project: CreateProjectDTO, @Body("workerId") workerId: Object,) {

        const conflict = await this.ProjectService.findByName(project.projName)
        if (conflict) {
            throw new ConflictException("project already exist");
        }
        const newProject = await this.ProjectService.createProj(project, workerId);
        return newProject;
    }

    @Get()
    @CheckAbilities({ action: Action.Manage, subject: Project })
    async getAllProject(@Query() pageData: object) {
        const paging = {
            page: pageData['page'] || 1,
            page_size: pageData['page_size'] || 2,
        }
        const projects = await this.ProjectService.getAllObj(paging);
        const [data, total] = projects;
        const pagingData = new Paging(paging.page, paging.page_size, total)

        return new ResponseData(200, data, 'success', pagingData);
    }

    @Get(':id')
    @CheckAbilities({ action: Action.Manage, subject: Project })
    async getProject(@Param('id') projectId: string) {
        const project = await this.ProjectService.GetOneObj(projectId)
        if (!project) {
            throw new NotFoundException('this project doesnt exist!')
        }
        return project;
    }

    @Put(':id')
    @CheckAbilities({ action: Action.Manage, subject: Project })
    async updateProject(
        @Param('id') projectId: string,
        @Body() data: Partial<UpdateProjectDTO>
    ) {
        const check = await this.ProjectService.GetOneObj(projectId);
        if (!check) {
            throw new NotFoundException('Project not found to update!')
        }
        return await this.ProjectService.UpdateOneObj(projectId, data);
    }


    // manage worker in proj
    @Put('/worker/:id')
    @CheckAbilities({ action: Action.Manage, subject: User })
    async addToProj(
        @Param('id') projectId: string,
        @Body() workerId: Object,
    ) {
        const AddWorker = await this.ProjectService.addWorkerToProj(projectId, workerId);
        return AddWorker;
    }

    @Get('/worker/:id')
    @CheckAbilities({ action: Action.Manage, subject: User })
    async getWorkerProject(
        @Param('id') projectId: string
    ) {
        const AddWorker = await this.ProjectService.getWorkerProj(projectId);
        console.log(AddWorker)
        return AddWorker;
    }

    @Delete('/worker/:id')
    @CheckAbilities({ action: Action.Manage, subject: User })
    async delFromProj(
        @Param('id') projectId: string,
        @Body() workerId: Object,
    ) {
        const DelWorker = await this.ProjectService.delWorkerFromProj(projectId, workerId);
        return DelWorker;
    }

    //manage task in proj

    @Get('/task/:id')
    @CheckAbilities({ action: Action.Manage, subject: User })
    async getTaskProject(
        @Param('id') projectId: string
    ) {
        const getTask = await this.ProjectService.getTaskProj(projectId);
        return getTask;
    }

    @Put('/task/:id')
    @CheckAbilities({ action: Action.Manage, subject: User })
    async addTaskProj(
        @Param('id') projectId: string,
        @Body() taskId: Object,
    ) {
        const AddTask = await this.ProjectService.addTaskToProj(projectId, taskId);
        return AddTask;
    }

    @Delete('/task/:id')
    @CheckAbilities({ action: Action.Manage, subject: User })
    async delTaskFromProj(
        @Param('id') projectId: string,
        @Body() taskId: Object,
    ) {
        const DelTask = await this.ProjectService.delTkFromProj(projectId, taskId);
        return DelTask;
    }

}
