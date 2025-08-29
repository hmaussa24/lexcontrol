import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SUPABASE } from '../supabase/supabase.module';
import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = process.env.DOCUMENTS_BUCKET || 'documents';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SUPABASE) private readonly supabase: SupabaseClient,
  ) {}

  private async ensureBucketExists(): Promise<void> {
    const { data: buckets } = await this.supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      await this.supabase.storage.createBucket(BUCKET, { public: false });
    }
  }

  listByCase(orgId: string, caseId: string, filters?: { q?: string; access?: string; tag?: string }) {
    return (this.prisma as any).document.findMany({
      where: {
        caseId,
        case: { organizationId: orgId },
        ...(filters?.q ? { name: { contains: filters.q, mode: 'insensitive' } } : {}),
        ...(filters?.access ? { access: filters.access } : {}),
        ...(filters?.tag ? { tags: { has: filters.tag } } : {}),
      },
      include: { currentVersion: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async uploadNewVersion(params: {
    orgId: string;
    caseId: string;
    name: string;
    folder?: string;
    file: { buffer: Buffer; mimetype?: string; originalname?: string; size?: number };
    userId?: string;
  }) {
    // Validar caso
    const kase = await this.prisma.case.findFirst({ where: { id: params.caseId, organizationId: params.orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');

    // Crear Document
    const doc = await (this.prisma as any).document.create({
      data: {
        caseId: params.caseId,
        name: params.name,
        folder: params.folder,
        access: 'private',
      },
    });

    // Calcular versión
    const versionNumber = 1;
    const filename = params.file.originalname || params.name;
    const storageKey = `cases/${params.caseId}/${doc.id}/v${versionNumber}/${filename}`;

    // Asegurar bucket y subir a Supabase Storage
    await this.ensureBucketExists();
    const { error: upErr } = await this.supabase.storage
      .from(BUCKET)
      .upload(storageKey, params.file.buffer, {
        contentType: params.file.mimetype || 'application/octet-stream',
        upsert: false,
      });
    if (upErr) {
      if ((upErr as any).status === 404 || (upErr as any).statusCode === 404 || (upErr as any).status === '404') {
        throw new NotFoundException(upErr.message);
      }
      throw new BadRequestException(upErr.message);
    }

    // Crear versión y setear currentVersion
    const ver = await (this.prisma as any).documentVersion.create({
      data: {
        documentId: doc.id,
        storageKey,
        mime: params.file.mimetype,
        size: params.file.size,
        version: versionNumber,
        createdById: params.userId,
      },
    });

    const updated = await (this.prisma as any).document.update({
      where: { id: doc.id },
      data: { currentVersionId: ver.id },
      include: { currentVersion: true },
    });

    // URL firmada de descarga (15 min)
    const { data: signed, error: signErr } = await this.supabase.storage
      .from(BUCKET)
      .createSignedUrl(storageKey, 900);
    if (signErr) {
      if ((signErr as any).status === 404 || (signErr as any).statusCode === 404 || (signErr as any).status === '404') {
        throw new NotFoundException(signErr.message);
      }
      throw new BadRequestException(signErr.message);
    }

    return { document: updated, downloadUrl: signed?.signedUrl };
  }

  async signedUrlForDocument(orgId: string, documentId: string) {
    const doc = await (this.prisma as any).document.findFirst({
      where: { id: documentId, case: { organizationId: orgId } },
      include: { currentVersion: true },
    });
    if (!doc) throw new NotFoundException('Documento no encontrado');
    const storageKey: string | undefined = doc.currentVersion?.storageKey;
    if (!storageKey) throw new NotFoundException('Versión actual no disponible');
    const { data: signed, error } = await this.supabase.storage.from(BUCKET).createSignedUrl(storageKey, 900);
    if (error) {
      if ((error as any).status === 404 || (error as any).statusCode === 404 || (error as any).status === '404') {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
    return { url: signed?.signedUrl };
  }

  async updateDocument(orgId: string, id: string, data: Partial<{ name: string; access: string; tags: string[] }>) {
    const existing = await (this.prisma as any).document.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Documento no encontrado');
    const updated = await (this.prisma as any).document.update({ where: { id }, data });
    return updated;
  }

  async listVersions(orgId: string, documentId: string) {
    const doc = await (this.prisma as any).document.findFirst({ where: { id: documentId, case: { organizationId: orgId } } });
    if (!doc) throw new NotFoundException('Documento no encontrado');
    return (this.prisma as any).documentVersion.findMany({ where: { documentId }, orderBy: { version: 'desc' } });
  }

  async signedUrlForVersion(orgId: string, versionId: string) {
    const ver = await (this.prisma as any).documentVersion.findFirst({ where: { id: versionId, document: { case: { organizationId: orgId } } } });
    if (!ver) throw new NotFoundException('Versión no encontrada');
    const { data, error } = await this.supabase.storage.from(BUCKET).createSignedUrl(ver.storageKey, 900);
    if (error) {
      if ((error as any).status === 404 || (error as any).statusCode === 404 || (error as any).status === '404') {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
    return { url: data?.signedUrl };
  }

  async uploadNewVersionForDocument(params: { orgId: string; documentId: string; file: { buffer: Buffer; mimetype?: string; originalname?: string; size?: number }; userId?: string }) {
    const doc = await (this.prisma as any).document.findFirst({ where: { id: params.documentId, case: { organizationId: params.orgId } } });
    if (!doc) throw new NotFoundException('Documento no encontrado');

    // calcular nueva versión
    const last = await (this.prisma as any).documentVersion.findFirst({ where: { documentId: params.documentId }, orderBy: { version: 'desc' } });
    const nextVersion = (last?.version || 0) + 1;
    const filename = params.file.originalname || `archivo`;
    const storageKey = `cases/${doc.caseId}/${doc.id}/v${nextVersion}/${filename}`;

    await this.ensureBucketExists();
    const { error: upErr } = await this.supabase.storage
      .from(BUCKET)
      .upload(storageKey, params.file.buffer, { contentType: params.file.mimetype || 'application/octet-stream', upsert: false });
    if (upErr) {
      if ((upErr as any).status === 404 || (upErr as any).statusCode === 404 || (upErr as any).status === '404') {
        throw new NotFoundException(upErr.message);
      }
      throw new BadRequestException(upErr.message);
    }

    const ver = await (this.prisma as any).documentVersion.create({
      data: {
        documentId: params.documentId,
        storageKey,
        mime: params.file.mimetype,
        size: params.file.size,
        version: nextVersion,
        createdById: params.userId,
      },
    });

    await (this.prisma as any).document.update({ where: { id: params.documentId }, data: { currentVersionId: ver.id } });
    return ver;
  }
}


