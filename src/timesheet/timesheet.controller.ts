import { Controller, Post, Get, Body, Param, Patch, Delete, Res, Put, HttpCode, UseGuards, Req, NotFoundException, NotAcceptableException, Query } from '@nestjs/common';
import { CreateTimeSheetDTO } from './dto/create-ts.dto';
import { UpdateTimeSheetDTO } from './dto/update-ts.dto';
import { TimesheetService } from './timesheet.service';
import { ApproveTimeSheetDTO } from './dto/approve-ts.dto';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { CheckAbilities } from 'src/casl/ability.decorator';
import { Action } from 'src/casl/ability.factory';
import { Timesheet } from './timesheet.entity';
import { Paging } from 'src/common/response/paging';
import { ResponseData } from 'src/common/response/responseData';

@Controller('timesheet')
@UseGuards(AuthenticationGuard)
export class TimesheetController {
    constructor(private readonly TsService: TimesheetService) { }

    @Post()
    @CheckAbilities({ action: Action.Create, subject: Timesheet })
    async addTimesheet(
        @Body() ts: CreateTimeSheetDTO,
        @Body('creatorId') creatorId: string,
        @Body('projectId') projectId: string,
        @Body('taskId') taskId: string
    ) {
        const newTimesheet = await this.TsService.createTimesheet(ts, creatorId, projectId, taskId);
        return newTimesheet;
    }

    @Get()
    @CheckAbilities({ action: Action.Read, subject: Timesheet })
    async getAllTimesheet(@Query() pageData: object) {
        const paging = {
            page: pageData['page'] || 1,
            page_size: pageData['page_size'] || 2,
        }
        const tss = await this.TsService.getAllObj(paging);
        const [data, total] = tss;
        const pagingData = new Paging(paging.page, paging.page_size, total)

        return new ResponseData(200, data, 'success', pagingData);
    }

    @Get(':id')
    @CheckAbilities({ action: Action.Read, subject: Timesheet })
    async getTimesheet(@Param('id') timesheetId: string) {
        return this.TsService.getSingleTimesheet(timesheetId);
    }

    @Put(':id')
    @CheckAbilities({ action: Action.Update, subject: Timesheet })
    async updateTimesheet(
        @Param('id') id: string,
        @Body() data: UpdateTimeSheetDTO,
        @Body('creatorId') creatorId: string,
        @Body('projectId') projectId: string,
        @Body('taskId') taskId: string
    ) {
        return await this.TsService.updateTimesheet(id, data, creatorId, projectId, taskId);
    }

    //PM function
    @Get('/pending')
    @CheckAbilities({ action: Action.Read, subject: Timesheet })
    async getPendingTS() {
        return await this.TsService.getAllPendingTS();
    }

    @Get('/week/:id')
    @CheckAbilities({ action: Action.Read, subject: Timesheet })
    async getByWeek(@Param('id') timesheetId: string) {
        return this.TsService.getMyTimesheetByWeek(timesheetId);
    }

    @Get('/project/:id')
    @CheckAbilities({ action: Action.Read, subject: Timesheet })
    async getByProject(@Param('id') projectId: string) {
        return this.TsService.getMyTimesheetByProject(projectId);
    }

    @Get('/worker/:id')
    @CheckAbilities({ action: Action.Read, subject: Timesheet })
    async getByPeople(@Param('id') userId: string) {
        return this.TsService.getTSByPeople(userId);
    }

    @Put('/approve')
    @CheckAbilities({ action: Action.Update, subject: Timesheet })
    async approveByWeek(@Body() data: ApproveTimeSheetDTO) {
        return this.TsService.approveTSByWeek(data);
    }

    @Get('/all/week')
    async getAllByWeek() {
        return this.TsService.getAllTSByWeek();
    }

    //User own timesheet function
    @Get('/day/:id')
    @CheckAbilities({ action: Action.Manage, subject: Timesheet })
    async getByDay(@Param('id') timesheetId: string) {
        return this.TsService.getMyTimesheetByDay(timesheetId);
    }

    @Put('/week/:id')
    @CheckAbilities({ action: Action.Manage, subject: Timesheet })
    async submitByWeek(@Param('id') timesheetId: string) {
        return this.TsService.submitMyTimesheetByWeek(timesheetId);
    }

}
