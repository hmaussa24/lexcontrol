import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TaskAttachmentsService } from './task-attachments.service';

@UseGuards(JwtAuthGuard)
@Controller('task-attachments')
export class TaskAttachmentsController {
  constructor(private readonly service: TaskAttachmentsService) {}

  @Get('task/:taskId')
  list(@Req() req: any, @Param('taskId') taskId: string) {
    return this.service.list(req.user.org, taskId);
  }

  @Post('upload')
  upload(
    @Req() req: any,
    @Body() body: { taskId: string; name: string; fileBase64: string; mime?: string }
  ) {
    return this.service.upload({ orgId: req.user.org, taskId: body.taskId, name: body.name, fileBase64: body.fileBase64, mime: body.mime, userId: req.user.sub });
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.org, id);
  }

  @Get(':id/signed-url')
  signed(@Req() req: any, @Param('id') id: string) {
    return this.service.signedUrl(req.user.org, id);
  }
}


