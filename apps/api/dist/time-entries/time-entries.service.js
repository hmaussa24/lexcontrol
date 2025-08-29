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
exports.TimeEntriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TimeEntriesService = class TimeEntriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listByCase(orgId, caseId, filters) {
        const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        return this.prisma.timeEntry.findMany({
            where: {
                caseId,
                userId: filters?.userId || undefined,
                billable: typeof filters?.billable === 'boolean' ? filters.billable : undefined,
                date: {
                    gte: filters?.from,
                    lte: filters?.to,
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    async create(orgId, data) {
        const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        return this.prisma.timeEntry.create({ data });
    }
    async update(orgId, id, data) {
        const existing = await this.prisma.timeEntry.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Entrada de tiempo no encontrada');
        return this.prisma.timeEntry.update({ where: { id }, data });
    }
    async remove(orgId, id) {
        const existing = await this.prisma.timeEntry.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Entrada de tiempo no encontrada');
        await this.prisma.timeEntry.delete({ where: { id } });
        return { ok: true };
    }
    async summary(orgId, caseId, filters) {
        const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        const where = {
            caseId,
            userId: filters?.userId || undefined,
            billable: typeof filters?.billable === 'boolean' ? filters.billable : undefined,
            date: { gte: filters?.from, lte: filters?.to },
        };
        const entries = await this.prisma.timeEntry.findMany({ where });
        const minutesTotal = entries.reduce((a, b) => a + (b.minutes || 0), 0);
        const minutesBillable = entries.filter(e => e.billable).reduce((a, b) => a + (b.minutes || 0), 0);
        return { minutesTotal, minutesBillable, hoursTotal: minutesTotal / 60, hoursBillable: minutesBillable / 60 };
    }
};
exports.TimeEntriesService = TimeEntriesService;
exports.TimeEntriesService = TimeEntriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TimeEntriesService);
//# sourceMappingURL=time-entries.service.js.map