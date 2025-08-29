import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ClientsService } from './clients.service';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Get()
  list(
    @Req() req: any,
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sort') sort?: string,
    @Query('dir') dir?: string,
  ) {
    return this.clients.list(req.user.org, { q, type, status, page: page ? parseInt(page) : undefined, pageSize: pageSize ? parseInt(pageSize) : undefined, sort, dir: dir as any });
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.clients.get(req.user.org, id);
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: { name: string; type: string; identification?: string; email?: string; phones?: string[]; addressLine?: string; city?: string; state?: string; country?: string; postalCode?: string; contact?: any; responsibleLawyerId?: string; tags?: string[] },
  ) {
    return this.clients.create(req.user.org, body);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; type: string; identification?: string; email?: string; phones?: string[]; addressLine?: string; city?: string; state?: string; country?: string; postalCode?: string; contact?: any; status?: string; responsibleLawyerId?: string; tags?: string[] }>,
  ) {
    return this.clients.update(req.user.org, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.clients.remove(req.user.org, id);
  }
}


