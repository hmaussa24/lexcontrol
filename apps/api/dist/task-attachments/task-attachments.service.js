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
exports.TaskAttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_module_1 = require("../supabase/supabase.module");
const BUCKET = process.env.DOCUMENTS_BUCKET || 'documents';
let TaskAttachmentsService = class TaskAttachmentsService {
    prisma;
    supabase;
    constructor(prisma, supabase) {
        this.prisma = prisma;
        this.supabase = supabase;
    }
    async list(orgId, taskId) {
        const task = await this.prisma.caseTask.findFirst({ where: { id: taskId, case: { organizationId: orgId } } });
        if (!task)
            throw new common_1.NotFoundException('Tarea no encontrada');
        return this.prisma.taskAttachment.findMany({ where: { taskId }, orderBy: { createdAt: 'desc' } });
    }
    async upload(params) {
        const task = await this.prisma.caseTask.findFirst({ where: { id: params.taskId, case: { organizationId: params.orgId } } });
        if (!task)
            throw new common_1.NotFoundException('Tarea no encontrada');
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
            if (upErr.status === 404 || upErr.statusCode === 404 || upErr.status === '404') {
                throw new common_1.NotFoundException(upErr.message);
            }
            throw new common_1.BadRequestException(upErr.message);
        }
        return this.prisma.taskAttachment.create({ data: { taskId: params.taskId, name: params.name, storageKey, size: buffer.length, mime: params.mime, createdById: params.userId } });
    }
    async remove(orgId, id) {
        const att = await this.prisma.taskAttachment.findFirst({ where: { id, task: { case: { organizationId: orgId } } } });
        if (!att)
            throw new common_1.NotFoundException('Adjunto no encontrado');
        await this.prisma.taskAttachment.delete({ where: { id } });
        const { error: rmErr } = await this.supabase.storage.from(BUCKET).remove([att.storageKey]);
        if (rmErr) {
            if (rmErr.status === 404 || rmErr.statusCode === 404 || rmErr.status === '404') {
                throw new common_1.NotFoundException(rmErr.message);
            }
            throw new common_1.BadRequestException(rmErr.message);
        }
        return { ok: true };
    }
    async signedUrl(orgId, id) {
        const att = await this.prisma.taskAttachment.findFirst({ where: { id, task: { case: { organizationId: orgId } } } });
        if (!att)
            throw new common_1.NotFoundException('Adjunto no encontrado');
        const { data, error } = await this.supabase.storage.from(BUCKET).createSignedUrl(att.storageKey, 900);
        if (error) {
            if (error.status === 404 || error.statusCode === 404 || error.status === '404') {
                throw new common_1.NotFoundException(error.message);
            }
            throw new common_1.BadRequestException(error.message);
        }
        return { url: data?.signedUrl };
    }
};
exports.TaskAttachmentsService = TaskAttachmentsService;
exports.TaskAttachmentsService = TaskAttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(supabase_module_1.SUPABASE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Function])
], TaskAttachmentsService);
//# sourceMappingURL=task-attachments.service.js.map