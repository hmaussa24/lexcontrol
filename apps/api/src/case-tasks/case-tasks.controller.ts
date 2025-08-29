import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CaseTasksService } from './case-tasks.service';

@UseGuards(JwtAuthGuard)
@Controller('case-tasks')
export class CaseTasksController {
  constructor(private readonly service: CaseTasksService) {}

  @Get('case/:caseId')
  list(@Req() req: any, @Param('caseId') caseId: string) {
    return this.service.listByCase(req.user.org, caseId);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: { caseId: string; title: string; description?: string; status?: string; priority?: number; dueAt?: string; assigneeId?: string }
  ) {
    return this.service.create(req.user.org, { ...body, dueAt: body.dueAt ? new Date(body.dueAt) : undefined } as any);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ title: string; description?: string; status?: string; priority?: number; dueAt?: string; assigneeId?: string; order?: number }>
  ) {
    return this.service.update(req.user.org, id, { ...body, dueAt: body.dueAt ? new Date(body.dueAt) : undefined } as any);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.org, id);
  }

  @Get('summary')
  summary(@Req() req: any) {
    return this.service.summary(req.user.org);
  }
}


