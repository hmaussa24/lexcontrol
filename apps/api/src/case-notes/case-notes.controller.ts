import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CaseNotesService } from './case-notes.service';

@UseGuards(JwtAuthGuard)
@Controller('case-notes')
export class CaseNotesController {
  constructor(private readonly service: CaseNotesService) {}

  @Get('case/:caseId')
  list(@Req() req: any, @Param('caseId') caseId: string) {
    return this.service.listByCase(req.user.org, caseId);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: { caseId: string; content: string },
  ) {
    return this.service.create(req.user.org, req.user.sub, body);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ content: string }>,
  ) {
    return this.service.update(req.user.org, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.org, id);
  }
}


