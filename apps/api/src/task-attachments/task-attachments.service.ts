import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SUPABASE } from '../supabase/supabase.module';
import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = process.env.DOCUMENTS_BUCKET || 'documents';

@Injectable()
export class TaskAttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SUPABASE) private readonly supabase: SupabaseClient,
  ) {}

  async list(orgId: string, taskId: string) {
    const task = await (this.prisma as any).caseTask.findFirst({ where: { id: taskId, case: { organizationId: orgId } } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    return (this.prisma as any).taskAttachment.findMany({ where: { taskId }, orderBy: { createdAt: 'desc' } });
  }

  async upload(params: { orgId: string; taskId: string; name: string; fileBase64: string; mime?: string; userId?: string }) {
    const task = await (this.prisma as any).caseTask.findFirst({ where: { id: params.taskId, case: { organizationId: params.orgId } } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    const buffer = Buffer.from(params.fileBase64, 'base64');
    const storageKey = `tasks/${task.caseId}/${params.taskId}/${Date.now()}_${params.name}`;
    const { data: buckets } = await this.supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      await this.supabase.storage.createBucket(BUCKET, { public: false });
    }
    const { error: upErr } = await this.supabase.storage
      .from(BUCKET)
      .upload(storageKey, buffer, { contentType: params.mime || 'application/octet-stream', upsert: false });
    if (upErr) {
      if ((upErr as any).status === 404 || (upErr as any).statusCode === 404 || (upErr as any).status === '404') {
        throw new NotFoundException(upErr.message);
      }
      throw new BadRequestException(upErr.message);
    }
    return (this.prisma as any).taskAttachment.create({ data: { taskId: params.taskId, name: params.name, storageKey, size: buffer.length, mime: params.mime, createdById: params.userId } });
  }

  async remove(orgId: string, id: string) {
    const att = await (this.prisma as any).taskAttachment.findFirst({ where: { id, task: { case: { organizationId: orgId } } } });
    if (!att) throw new NotFoundException('Adjunto no encontrado');
    await (this.prisma as any).taskAttachment.delete({ where: { id } });
    const { error: rmErr } = await this.supabase.storage.from(BUCKET).remove([att.storageKey]);
    if (rmErr) {
      if ((rmErr as any).status === 404 || (rmErr as any).statusCode === 404 || (rmErr as any).status === '404') {
        throw new NotFoundException(rmErr.message);
      }
      throw new BadRequestException(rmErr.message);
    }
    return { ok: true };
  }

  async signedUrl(orgId: string, id: string) {
    const att = await (this.prisma as any).taskAttachment.findFirst({ where: { id, task: { case: { organizationId: orgId } } } });
    if (!att) throw new NotFoundException('Adjunto no encontrado');
    const { data, error } = await this.supabase.storage.from(BUCKET).createSignedUrl(att.storageKey, 900);
    if (error) {
      if ((error as any).status === 404 || (error as any).statusCode === 404 || (error as any).status === '404') {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
    return { url: data?.signedUrl };
  }
}


