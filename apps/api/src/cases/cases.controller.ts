import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CasesService } from './cases.service';

@UseGuards(JwtAuthGuard)
@Controller('cases')
export class CasesController {
  constructor(private readonly cases: CasesService) {}

  @Get()
  list(
    @Req() req: any,
    @Query('q') q?: string,
    @Query('status') status?: string,
    @Query('clientId') clientId?: string,
    @Query('processType') processType?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sort') sort?: string,
    @Query('dir') dir?: string,
  ) {
    return this.cases.list(req.user.org, {
      q,
      status,
      clientId,
      processType,
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
      sort,
      dir,
    });
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.cases.get(req.user.org, id);
  }

  @Get(':id/summary')
  summary(@Req() req: any, @Param('id') id: string) {
    return this.cases.summary(req.user.org, id);
  }

  @Post()
  create(
    @Req() req: any,
    @Body()
    body: { expedienteNumber: string; processType: string; title: string; description?: string; clientId: string; court?: string; jurisdiction?: string; responsibleLawyerId?: string },
  ) {
    return this.cases.create(req.user.org, body);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ processType: string; title: string; description?: string; status: string; court?: string; jurisdiction?: string; responsibleLawyerId?: string }>,
  ) {
    return this.cases.update(req.user.org, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.cases.remove(req.user.org, id);
  }
}


