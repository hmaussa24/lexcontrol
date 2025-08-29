import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TimeEntriesService } from './time-entries.service';

@UseGuards(JwtAuthGuard)
@Controller('time-entries')
export class TimeEntriesController {
  constructor(private readonly service: TimeEntriesService) {}

  @Get('case/:caseId')
  list(
    @Req() req: any,
    @Param('caseId') caseId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('userId') userId?: string,
    @Query('billable') billable?: string,
  ) {
    return this.service.listByCase(req.user.org, caseId, { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined, userId, billable: billable === 'true' ? true : billable === 'false' ? false : undefined });
  }

  @Get('case/:caseId/summary')
  summary(@Req() req: any, @Param('caseId') caseId: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.service.summary(req.user.org, caseId, { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined });
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: { caseId: string; userId?: string; date: string; minutes: number; description?: string; billable?: boolean; hourlyRate?: any },
  ) {
    return this.service.create(req.user.org, { ...body, date: new Date(body.date) });
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: Partial<{ date: string; minutes: number; description?: string; billable?: boolean; hourlyRate?: any; userId?: string }>) {
    return this.service.update(req.user.org, id, { ...body, date: body.date ? new Date(body.date) : undefined });
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.org, id);
  }
}


