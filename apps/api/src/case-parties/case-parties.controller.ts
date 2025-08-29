import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CasePartiesService } from './case-parties.service';

@UseGuards(JwtAuthGuard)
@Controller('case-parties')
export class CasePartiesController {
  constructor(private readonly service: CasePartiesService) {}

  @Get('case/:caseId')
  list(@Req() req: any, @Param('caseId') caseId: string) {
    return this.service.listByCase(req.user.org, caseId);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: { caseId: string; type: string; name: string; identification?: string; opposingLawyer?: any },
  ) {
    return this.service.create(req.user.org, body);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ type: string; name: string; identification?: string; opposingLawyer?: any }>,
  ) {
    return this.service.update(req.user.org, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.org, id);
  }
}


