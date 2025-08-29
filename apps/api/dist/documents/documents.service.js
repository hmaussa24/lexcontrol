"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_module_1 = require("../supabase/supabase.module");
const BUCKET = process.env.DOCUMENTS_BUCKET || 'documents';
let DocumentsService = class DocumentsService {
    prisma;
    supabase;
    constructor(prisma, supabase) {
        this.prisma = prisma;
        this.supabase = supabase;
    }
    async ensureBucketExists() {
        const { data: buckets } = await this.supabase.storage.listBuckets();
        const exists = buckets?.some((b) => b.name === BUCKET);
        if (!exists) {
            await this.supabase.storage.createBucket(BUCKET, { public: false });
        }
    }
    listByCase(orgId, caseId, filters) {
        return this.prisma.document.findMany({
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
    async uploadNewVersion(params) {
        const kase = await this.prisma.case.findFirst({ where: { id: params.caseId, organizationId: params.orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        const doc = await this.prisma.document.create({
            data: {
                caseId: params.caseId,
                name: params.name,
                folder: params.folder,
                access: 'private',
            },
        });
        const versionNumber = 1;
        const filename = params.file.originalname || params.name;
        const storageKey = `cases/${params.caseId}/${doc.id}/v${versionNumber}/${filename}`;
        await this.ensureBucketExists();
        const { error: upErr } = await this.supabase.storage
            .from(BUCKET)
            .upload(storageKey, params.file.buffer, {
            contentType: params.file.mimetype || 'application/octet-stream',
            upsert: false,
        });
        if (upErr) {
            if (upErr.status === 404 || upErr.statusCode === 404 || upErr.status === '404') {
                throw new common_1.NotFoundException(upErr.message);
            }
            throw new common_1.BadRequestException(upErr.message);
        }
        const ver = await this.prisma.documentVersion.create({
            data: {
                documentId: doc.id,
                storageKey,
                mime: params.file.mimetype,
                size: params.file.size,
                version: versionNumber,
                createdById: params.userId,
            },
        });
        const updated = await this.prisma.document.update({
            where: { id: doc.id },
            data: { currentVersionId: ver.id },
            include: { currentVersion: true },
        });
        const { data: signed, error: signErr } = await this.supabase.storage
            .from(BUCKET)
            .createSignedUrl(storageKey, 900);
        if (signErr) {
            if (signErr.status === 404 || signErr.statusCode === 404 || signErr.status === '404') {
                throw new common_1.NotFoundException(signErr.message);
            }
            throw new common_1.BadRequestException(signErr.message);
        }
        return { document: updated, downloadUrl: signed?.signedUrl };
    }
    async signedUrlForDocument(orgId, documentId) {
        const doc = await this.prisma.document.findFirst({
            where: { id: documentId, case: { organizationId: orgId } },
            include: { currentVersion: true },
        });
        if (!doc)
            throw new common_1.NotFoundException('Documento no encontrado');
        const storageKey = doc.currentVersion?.storageKey;
        if (!storageKey)
            throw new common_1.NotFoundException('Versión actual no disponible');
        const { data: signed, error } = await this.supabase.storage.from(BUCKET).createSignedUrl(storageKey, 900);
        if (error) {
            if (error.status === 404 || error.statusCode === 404 || error.status === '404') {
                throw new common_1.NotFoundException(error.message);
            }
            throw new common_1.BadRequestException(error.message);
        }
        return { url: signed?.signedUrl };
    }
    async updateDocument(orgId, id, data) {
        const existing = await this.prisma.document.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Documento no encontrado');
        const updated = await this.prisma.document.update({ where: { id }, data });
        return updated;
    }
    async listVersions(orgId, documentId) {
        const doc = await this.prisma.document.findFirst({ where: { id: documentId, case: { organizationId: orgId } } });
        if (!doc)
            throw new common_1.NotFoundException('Documento no encontrado');
        return this.prisma.documentVersion.findMany({ where: { documentId }, orderBy: { version: 'desc' } });
    }
    async signedUrlForVersion(orgId, versionId) {
        const ver = await this.prisma.documentVersion.findFirst({ where: { id: versionId, document: { case: { organizationId: orgId } } } });
        if (!ver)
            throw new common_1.NotFoundException('Versión no encontrada');
        const { data, error } = await this.supabase.storage.from(BUCKET).createSignedUrl(ver.storageKey, 900);
        if (error) {
            if (error.status === 404 || error.statusCode === 404 || error.status === '404') {
                throw new common_1.NotFoundException(error.message);
            }
            throw new common_1.BadRequestException(error.message);
        }
        return { url: data?.signedUrl };
    }
    async uploadNewVersionForDocument(params) {
        const doc = await this.prisma.document.findFirst({ where: { id: params.documentId, case: { organizationId: params.orgId } } });
        if (!doc)
            throw new common_1.NotFoundException('Documento no encontrado');
        const last = await this.prisma.documentVersion.findFirst({ where: { documentId: params.documentId }, orderBy: { version: 'desc' } });
        const nextVersion = (last?.version || 0) + 1;
        const filename = params.file.originalname || `archivo`;
        const storageKey = `cases/${doc.caseId}/${doc.id}/v${nextVersion}/${filename}`;
        await this.ensureBucketExists();
        const { error: upErr } = await this.supabase.storage
            .from(BUCKET)
            .upload(storageKey, params.file.buffer, { contentType: params.file.mimetype || 'application/octet-stream', upsert: false });
        if (upErr) {
            if (upErr.status === 404 || upErr.statusCode === 404 || upErr.status === '404') {
                throw new common_1.NotFoundException(upErr.message);
            }
            throw new common_1.BadRequestException(upErr.message);
        }
        const ver = await this.prisma.documentVersion.create({
            data: {
                documentId: params.documentId,
                storageKey,
                mime: params.file.mimetype,
                size: params.file.size,
                version: nextVersion,
                createdById: params.userId,
            },
        });
        await this.prisma.document.update({ where: { id: params.documentId }, data: { currentVersionId: ver.id } });
        return ver;
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(supabase_module_1.SUPABASE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Function])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map