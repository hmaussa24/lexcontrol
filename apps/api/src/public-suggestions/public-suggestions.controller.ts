import { Body, Controller, Get, Ip, Param, Post, Query } from '@nestjs/common';
import { PublicSuggestionsService } from './public-suggestions.service';

@Controller('public/suggestions')
export class PublicSuggestionsController {
  constructor(private readonly service: PublicSuggestionsService) {}

  @Get()
  list(@Query('q') q?: string, @Query('sort') sort?: 'new'|'top', @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.service.list({ q, sort, page: page ? parseInt(page) : undefined, pageSize: pageSize ? parseInt(pageSize) : undefined });
  }

  @Post()
  create(@Body() body: { name: string; email: string; content: string; captchaToken: string }, @Ip() ip: string) {
    return this.service.create({ ...body, ip });
  }

  @Post(':id/vote')
  vote(@Param('id') id: string, @Body() body: { email?: string }, @Ip() ip: string) {
    return this.service.vote(id, { email: body?.email, ip });
  }
}


