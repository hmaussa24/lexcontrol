import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CaseAssignmentsService } from './case-assignments.service';

@UseGuards(JwtAuthGuard)
@Controller('case-assignments')
export class CaseAssignmentsController {
  constructor(private readonly service: CaseAssignmentsService) {}

  @Get('case/:caseId')
  list(@Req() req: any, @Param('caseId') caseId: string) {
    return this.service.listByCase(req.user.org, caseId);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: { caseId: string; userId: string; role: string; since?: string; until?: string },
  ) {
    return this.service.create(req.user.org, {
      ...body,
      since: body.since ? new Date(body.since) : undefined,
      until: body.until ? new Date(body.until) : undefined,
    });
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ role: string; since?: string; until?: string }>,
  ) {
    return this.service.update(req.user.org, id, {
      ...body,
      since: body.since ? new Date(body.since) : undefined,
      until: body.until ? new Date(body.until) : undefined,
    });
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.org, id);
  }
}


