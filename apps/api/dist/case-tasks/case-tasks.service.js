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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseTasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CaseTasksService = class CaseTasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listByCase(orgId, caseId) {
        const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        return this.prisma.caseTask.findMany({ where: { caseId }, orderBy: [{ status: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }] });
    }
    async create(orgId, data) {
        const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        return this.prisma.caseTask.create({ data: { ...data, status: data.status ?? 'TODO' } });
    }
    async update(orgId, id, data) {
        const existing = await this.prisma.caseTask.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Tarea no encontrada');
        return this.prisma.caseTask.update({ where: { id }, data: data });
    }
    async remove(orgId, id) {
        const existing = await this.prisma.caseTask.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Tarea no encontrada');
        await this.prisma.caseTask.delete({ where: { id } });
        return { ok: true };
    }
    async summary(orgId) {
        const now = new Date();
        const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const [pending, dueSoon] = await Promise.all([
            this.prisma.caseTask.count({ where: { case: { organizationId: orgId }, status: { in: ['TODO', 'IN_PROGRESS'] } } }),
            this.prisma.caseTask.count({ where: { case: { organizationId: orgId }, status: { not: 'DONE' }, dueAt: { lte: soon } } }),
        ]);
        return { pending, dueSoon };
    }
};
exports.CaseTasksService = CaseTasksService;
exports.CaseTasksService = CaseTasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CaseTasksService);
//# sourceMappingURL=case-tasks.service.js.map