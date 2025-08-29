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
exports.CaseNotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CaseNotesService = class CaseNotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listByCase(orgId, caseId) {
        const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        return this.prisma.caseNote.findMany({ where: { caseId }, orderBy: { createdAt: 'desc' } });
    }
    async create(orgId, userId, data) {
        const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        return this.prisma.caseNote.create({ data: { ...data, createdById: userId } });
    }
    async update(orgId, id, data) {
        const existing = await this.prisma.caseNote.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Nota no encontrada');
        return this.prisma.caseNote.update({ where: { id }, data });
    }
    async remove(orgId, id) {
        const existing = await this.prisma.caseNote.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Nota no encontrada');
        await this.prisma.caseNote.delete({ where: { id } });
        return { ok: true };
    }
};
exports.CaseNotesService = CaseNotesService;
exports.CaseNotesService = CaseNotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CaseNotesService);
//# sourceMappingURL=case-notes.service.js.map