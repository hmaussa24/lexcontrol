import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CaseActionsService } from './case-actions.service';

@UseGuards(JwtAuthGuard)
@Controller('case-actions')
export class CaseActionsController {
  constructor(private readonly service: CaseActionsService) {}

  @Get('case/:caseId')
  list(@Req() req: any, @Param('caseId') caseId: string) {
    return this.service.listByCase(req.user.org, caseId);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: { caseId: string; date: string; type: string; summary: string; documentId?: string },
  ) {
    return this.service.create(req.user.org, {
      caseId: body.caseId,
      date: new Date(body.date),
      type: body.type,
      summary: body.summary,
      documentId: body.documentId,
    });
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ date: string; type: string; summary: string; documentId?: string }>,
  ) {
    return this.service.update(req.user.org, id, {
      ...body,
      date: body.date ? new Date(body.date) : undefined,
    });
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.org, id);
  }
}


