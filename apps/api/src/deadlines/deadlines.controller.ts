import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { DeadlinesService } from './deadlines.service';

@UseGuards(JwtAuthGuard)
@Controller('deadlines')
export class DeadlinesController {
  constructor(private readonly deadlines: DeadlinesService) {}

  @Get('upcoming')
  upcoming(@Req() req: any, @Query('days') days?: string) {
    return this.deadlines.upcoming(req.user.org, days ? parseInt(days) : 30);
  }

  @Get('case/:caseId')
  listByCase(@Req() req: any, @Param('caseId') caseId: string) {
    return this.deadlines.listByCase(req.user.org, caseId);
  }

  @Post()
  create(
    @Req() req: any,
    @Body()
    body: { caseId: string; title: string; dueAt: string; type?: string; priority?: number; remindDays?: number; notes?: string },
  ) {
    return this.deadlines.create(req.user.org, { ...body, dueAt: new Date(body.dueAt) });
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ title: string; dueAt: string; type?: string; priority?: number; remindDays?: number; completed?: boolean; notes?: string }>,
  ) {
    return this.deadlines.update(req.user.org, id, {
      ...body,
      dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
    });
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.deadlines.remove(req.user.org, id);
  }
}


