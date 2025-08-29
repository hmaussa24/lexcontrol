import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { HearingsService } from './hearings.service';

@UseGuards(JwtAuthGuard)
@Controller('hearings')
export class HearingsController {
  constructor(private readonly hearings: HearingsService) {}

  @Get('upcoming')
  upcoming(@Req() req: any, @Query('days') days?: string) {
    return this.hearings.upcoming(req.user.org, days ? parseInt(days) : 30);
  }

  @Get('case/:caseId')
  listByCase(@Req() req: any, @Param('caseId') caseId: string) {
    return this.hearings.listByCase(req.user.org, caseId);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: { caseId: string; date: string; time?: string; location?: string; type?: string; attendees?: any; result?: string; notes?: string },
  ) {
    return this.hearings.create(req.user.org, { ...body, date: new Date(body.date) });
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ date: string; time?: string; location?: string; type?: string; attendees?: any; result?: string; notes?: string }>,
  ) {
    return this.hearings.update(req.user.org, id, { ...body, date: body.date ? new Date(body.date) : undefined });
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.hearings.remove(req.user.org, id);
  }
}


