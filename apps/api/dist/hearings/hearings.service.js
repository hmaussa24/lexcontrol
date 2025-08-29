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
exports.HearingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HearingsService = class HearingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listByCase(orgId, caseId) {
        return this.prisma.hearing.findMany({ where: { caseId, case: { organizationId: orgId } }, orderBy: { date: 'asc' } });
    }
    upcoming(orgId, days = 30) {
        const now = new Date();
        const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return this.prisma.hearing.findMany({
            where: { case: { organizationId: orgId }, date: { gte: now, lte: until } },
            orderBy: { date: 'asc' },
        });
    }
    async create(orgId, data) {
        const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        return this.prisma.hearing.create({ data });
    }
    async update(orgId, id, data) {
        const existing = await this.prisma.hearing.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Audiencia no encontrada');
        return this.prisma.hearing.update({ where: { id }, data });
    }
    async remove(orgId, id) {
        const existing = await this.prisma.hearing.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Audiencia no encontrada');
        await this.prisma.hearing.delete({ where: { id } });
        return { ok: true };
    }
};
exports.HearingsService = HearingsService;
exports.HearingsService = HearingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HearingsService);
//# sourceMappingURL=hearings.service.js.map