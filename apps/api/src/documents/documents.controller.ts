import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { DocumentsService } from './documents.service';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Get('case/:caseId')
  listByCase(
    @Req() req: any,
    @Param('caseId') caseId: string,
    @Query('q') q?: string,
    @Query('access') access?: string,
    @Query('tag') tag?: string,
  ) {
    return this.docs.listByCase(req.user.org, caseId, { q: q || undefined, access: access || undefined, tag: tag || undefined });
  }

  // Para simplificar, recibimos base64 (en producción usar multipart/form-data)
  @Post('upload')
  async upload(
    @Req() req: any,
    @Body()
    body: { caseId: string; name: string; folder?: string; fileBase64: string; mime?: string },
  ) {
    const buffer = Buffer.from(body.fileBase64, 'base64');
    return this.docs.uploadNewVersion({
      orgId: req.user.org,
      caseId: body.caseId,
      name: body.name,
      folder: body.folder,
      file: { buffer, mimetype: body.mime, originalname: body.name, size: buffer.length },
      userId: req.user.sub,
    });
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-multipart')
  async uploadMultipart(
    @Req() req: any,
    @Body() body: { caseId: string; name?: string; folder?: string },
    @UploadedFile() file: any,
  ) {
    if (!file) throw new Error('Archivo requerido');
    return this.docs.uploadNewVersion({
      orgId: req.user.org,
      caseId: body.caseId,
      name: body.name || file.originalname,
      folder: body.folder,
      file: { buffer: file.buffer, mimetype: file.mimetype, originalname: file.originalname, size: file.size },
      userId: req.user.sub,
    });
  }

  @Get(':id/signed-url')
  signed(@Req() req: any, @Param('id') id: string) {
    return this.docs.signedUrlForDocument(req.user.org, id);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; access: 'private' | 'equipo' | 'cliente'; tags: string[] }>,
  ) {
    return this.docs.updateDocument(req.user.org, id, body);
  }

  @Get(':id/versions')
  versions(@Req() req: any, @Param('id') id: string) {
    return this.docs.listVersions(req.user.org, id);
  }

  @Get('versions/:versionId/signed-url')
  versionSigned(@Req() req: any, @Param('versionId') versionId: string) {
    return this.docs.signedUrlForVersion(req.user.org, versionId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/upload-version')
  uploadVersion(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    if (!file) throw new Error('Archivo requerido');
    return this.docs.uploadNewVersionForDocument({ orgId: req.user.org, documentId: id, file: { buffer: file.buffer, mimetype: file.mimetype, originalname: file.originalname, size: file.size }, userId: req.user.sub });
  }
}


