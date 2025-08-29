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
exports.CasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CasesService = class CasesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(orgId, query) {
        const where = {
            organizationId: orgId,
            status: query?.status,
            clientId: query?.clientId || undefined,
            processType: query?.processType || undefined,
            OR: query?.q
                ? [
                    { expedienteNumber: { contains: query.q, mode: 'insensitive' } },
                    { title: { contains: query.q, mode: 'insensitive' } },
                    { client: { name: { contains: query.q, mode: 'insensitive' } } },
                ]
                : undefined,
        };
        const page = query?.page && query.page > 0 ? query.page : 1;
        const pageSize = query?.pageSize && query.pageSize > 0 ? query.pageSize : 20;
        const sortField = ['updatedAt', 'expedienteNumber', 'title'].includes(query?.sort || '') ? query.sort : 'updatedAt';
        const sortDir = (query?.dir === 'asc' || query?.dir === 'desc') ? query.dir : 'desc';
        const [total, data] = await Promise.all([
            this.prisma.case.count({ where }),
            this.prisma.case.findMany({ where, orderBy: { [sortField]: sortDir }, skip: (page - 1) * pageSize, take: pageSize }),
        ]);
        return { total, page, pageSize, data };
    }
    get(orgId, id) {
        return this.prisma.case.findFirst({ where: { id, organizationId: orgId } });
    }
    async create(orgId, data) {
        return this.prisma.case.create({
            data: {
                organizationId: orgId,
                expedienteNumber: data.expedienteNumber,
                processType: data.processType,
                title: data.title,
                description: data.description,
                clientId: data.clientId,
                court: data.court,
                jurisdiction: data.jurisdiction,
                responsibleLawyerId: data.responsibleLawyerId,
            },
        });
    }
    async update(orgId, id, data) {
        const existing = await this.get(orgId, id);
        if (!existing)
            throw new common_1.NotFoundException('Caso no encontrado');
        return this.prisma.case.update({
            where: { id },
            data: {
                processType: data.processType,
                title: data.title,
                description: data.description,
                status: data.status,
                court: data.court,
                jurisdiction: data.jurisdiction,
                responsibleLawyerId: data.responsibleLawyerId,
            },
        });
    }
    async remove(orgId, id) {
        const existing = await this.get(orgId, id);
        if (!existing)
            throw new common_1.NotFoundException('Caso no encontrado');
        await this.prisma.case.delete({ where: { id } });
        return { ok: true };
    }
    async summary(orgId, id) {
        const kase = await this.get(orgId, id);
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        const now = new Date();
        const [upcomingDeadlines, upcomingHearings, recentDocs, timeTotalAgg, timeBillableAgg, expensesAgg] = await Promise.all([
            this.prisma.deadline.findMany({
                where: { caseId: id, dueAt: { gte: now }, completed: false },
                orderBy: { dueAt: 'asc' },
                take: 5,
            }),
            this.prisma.hearing.findMany({
                where: { caseId: id, date: { gte: now } },
                orderBy: { date: 'asc' },
                take: 5,
            }),
            this.prisma.document.findMany({
                where: { caseId: id },
                include: { currentVersion: true },
                orderBy: { updatedAt: 'desc' },
                take: 5,
            }),
            this.prisma.timeEntry.aggregate({ where: { caseId: id }, _sum: { minutes: true } }),
            this.prisma.timeEntry.aggregate({ where: { caseId: id, billable: true }, _sum: { minutes: true } }),
            this.prisma.expense.aggregate({ where: { caseId: id }, _sum: { amount: true } }),
        ]);
        const minutesTotal = timeTotalAgg._sum.minutes || 0;
        const minutesBillable = timeBillableAgg._sum.minutes || 0;
        const hoursTotal = minutesTotal / 60;
        const hoursBillable = minutesBillable / 60;
        const expensesTotal = expensesAgg._sum.amount ? Number(expensesAgg._sum.amount.toString()) : 0;
        return {
            case: kase,
            kpis: {
                upcomingDeadlines: upcomingDeadlines.length,
                upcomingHearings: upcomingHearings.length,
                documentsCount: await this.prisma.document.count({ where: { caseId: id } }),
                hoursTotal,
                hoursBillable,
                expensesTotal,
            },
            upcomingDeadlines,
            upcomingHearings,
            recentDocuments: recentDocs,
        };
    }
};
exports.CasesService = CasesService;
exports.CasesService = CasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CasesService);
//# sourceMappingURL=cases.service.js.map