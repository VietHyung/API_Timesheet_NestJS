import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, ConflictException, NotFoundException, UseGuards, Req, NotAcceptableException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';

@Controller('projects')
@UseGuards(AuthenticationGuard)
export class ProjectController {
    constructor(private readonly ProjectService: ProjectService) { }

    @Post()
    async addProject(@Res() res, @Body() project: CreateProjectDTO, @Body("workerId") workerId: Object, @Req() request) {
        const checkUser = await this.ProjectService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')

        const conflict = await this.ProjectService.findByName(project.projName)
        if (conflict) {
            throw new ConflictException("project already exist");
        }
        const newProject = await this.ProjectService.createProj(project, workerId);
        return res.json({
            message: 'Project was created successfully!',
            project: newProject,
        })
    }


    // manage worker in proj
    @Put('/worker/:id')
    async addToProj(
        @Req() request,
        @Param('id') projectId: string,
        @Body() workerId: Object,
    ) {
        const checkUser = await this.ProjectService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')
        const AddWorker = await this.ProjectService.addWorkerToProj(projectId, workerId);
        return AddWorker;
    }

    @Get('/worker/:id')
    async getWorkerProject(
        @Req() request,
        @Param('id') projectId: string
    ) {
        const checkUser = await this.ProjectService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')
        const AddWorker = await this.ProjectService.getWorkerProj(projectId);
        console.log(AddWorker)
        return AddWorker;
    }

    @Delete('/worker/:id')
    async delFromProj(
        @Req() request,
        @Param('id') projectId: string,
        @Body() workerId: Object,
    ) {
        const checkUser = await this.ProjectService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')
        const DelWorker = await this.ProjectService.delWorkerFromProj(projectId, workerId);
        return DelWorker;
    }

    //manage task in proj

    @Get('/task/:id')
    async getTaskProject(
        @Req() request,
        @Param('id') projectId: string
    ) {
        const checkUser = await this.ProjectService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')
        const getTask = await this.ProjectService.getTaskProj(projectId);
        return getTask;
    }

    @Put('/task/:id')
    async addTaskProj(
        @Req() request,
        @Param('id') projectId: string,
        @Body() taskId: Object,
    ) {
        const checkUser = await this.ProjectService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')
        const AddTask = await this.ProjectService.addTaskToProj(projectId, taskId);
        return AddTask;
    }

    @Delete('/task/:id')
    async delTaskFromProj(
        @Req() request,
        @Param('id') projectId: string,
        @Body() taskId: Object,
    ) {
        const checkUser = await this.ProjectService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')
        const DelTask = await this.ProjectService.delTkFromProj(projectId, taskId);
        return DelTask;
    }

    @Get()
    async getAllProject() {
        const projects = await this.ProjectService.getAllObj();
        if (!projects) {
            throw new NotFoundException('table empty, need to add project!')
        }
        return projects;
    }

    @Get(':id')
    async getProject(@Param('id') projectId: string) {
        const project = await this.ProjectService.GetOneObj(projectId)
        if (!project) {
            throw new NotFoundException('this project doesnt exist!')
        }
        return project;
    }

    @Put(':id')
    async updateProject(
        @Req() request,
        @Param('id') projectId: string,
        @Body() data: Partial<UpdateProjectDTO>
    ) {
        const checkUser = await this.ProjectService.isAdmin(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only Admin function!')
        const check = await this.ProjectService.GetOneObj(projectId);
        if (!check) {
            throw new NotFoundException('Project not found to update!')
        }
        return await this.ProjectService.UpdateOneObj(projectId, data);
    }
}
