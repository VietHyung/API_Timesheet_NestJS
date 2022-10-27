import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, UseGuards, Req, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { CreateTimeSheetDTO } from './dto/create-ts.dto';
import { UpdateTimeSheetDTO } from './dto/update-ts.dto';
import { TimesheetService } from './timesheet.service';
import { ApproveTimeSheetDTO } from './dto/approve-ts.dto';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { User } from '../user/user.entity';

@Controller('timesheet')
@UseGuards(AuthenticationGuard)
export class TimesheetController {
    constructor(private readonly TsService: TimesheetService) { }

    @Post()
    async addTimesheet(
        @Res() res,
        @Body() ts: CreateTimeSheetDTO,
        @Body('creatorId') creatorId: string,
        @Body('projectId') projectId: string,
        @Body('taskId') taskId: string
    ) {
        const newTimesheet = await this.TsService.createTimesheet(ts, creatorId, projectId, taskId);
        return res.json({
            message: 'TimeSheet was created successfully!',
            timesheet: newTimesheet,
        })
    }

    @Get('/pending')
    async getPendingTS() {
        return await this.TsService.getAllPendingTS();
    }

    @Get()
    async getAllTimesheet() {
        const users = await this.TsService.getTimesheets();
        return users;
    }

    @Get(':id')
    async getTimesheet(@Param('id') timesheetId: string) {
        return this.TsService.getSingleTimesheet(timesheetId);
    }

    @Get('/day/:id')
    async getByDay(@Param('id') timesheetId: string, @Req() request) {
        const checkUser = await this.TsService.isUser(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only user function!')
        return this.TsService.getMyTimesheetByDay(timesheetId);
    }

    @Get('/week/:id')
    async getByWeek(@Param('id') timesheetId: string) {
        return this.TsService.getMyTimesheetByWeek(timesheetId);
    }

    @Get('/project/:id')
    async getByProject(@Param('id') projectId: string) {
        return this.TsService.getMyTimesheetByProject(projectId);
    }

    @Get('/worker/:id')
    async getByPeople(@Param('id') userId: string) {
        return this.TsService.getTSByPeople(userId);
    }

    @Put('/week/:id')
    async submitByWeek(@Param('id') timesheetId: string, @Req() request) {
        const checkUser = await this.TsService.isUser(request.user.id)
        if (!checkUser) throw new NotAcceptableException('only user function!')

        return this.TsService.submitMyTimesheetByWeek(timesheetId);
    }

    @Put('/approve')
    async approveByWeek(@Body() data: ApproveTimeSheetDTO) {
        return this.TsService.approveTSByWeek(data);
    }

    @Get('/all/week')
    async getAllByWeek() {
        return this.TsService.getAllTSByWeek();
    }


    @Put(':id')
    async updateTimesheet(
        @Param('id') id: string,
        @Body() data: UpdateTimeSheetDTO,
        @Body('creatorId') creatorId: string,
        @Body('projectId') projectId: string,
        @Body('taskId') taskId: string
    ) {
        return await this.TsService.updateTimesheet(id, data, creatorId, projectId, taskId);
    }
}
