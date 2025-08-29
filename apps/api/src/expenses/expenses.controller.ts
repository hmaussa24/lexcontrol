import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ExpensesService } from './expenses.service';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Get('case/:caseId')
  list(@Req() req: any, @Param('caseId') caseId: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.service.listByCase(req.user.org, caseId, { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined });
  }

  @Post()
  create(@Req() req: any, @Body() body: { caseId: string; userId?: string; date: string; concept: string; amount: any; currency?: string; notes?: string; receiptBase64?: string; receiptName?: string; receiptMime?: string }) {
    return this.service.create(req.user.org, { ...body, date: new Date(body.date) });
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: Partial<{ date: string; concept: string; amount: any; currency?: string; notes?: string }>) {
    return this.service.update(req.user.org, id, { ...body, date: body.date ? new Date(body.date) : undefined });
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.org, id);
  }

  @Get(':id/receipt')
  receipt(@Req() req: any, @Param('id') id: string) {
    return this.service.receiptSignedUrl(req.user.org, id);
  }
}


