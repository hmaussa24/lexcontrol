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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StatsService = class StatsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async dashboard(orgId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [timeAgg, expensesAgg, topCases] = await Promise.all([
            this.prisma.timeEntry.aggregate({
                where: { case: { organizationId: orgId }, date: { gte: startOfMonth, lte: now } },
                _sum: { minutes: true },
            }),
            this.prisma.expense.aggregate({
                where: { case: { organizationId: orgId }, date: { gte: startOfMonth, lte: now } },
                _sum: { amount: true },
            }),
            this.prisma.timeEntry.groupBy({
                by: ['caseId'],
                where: { case: { organizationId: orgId }, date: { gte: startOfMonth, lte: now } },
                _sum: { minutes: true },
                orderBy: { _sum: { minutes: 'desc' } },
                take: 5,
            }),
        ]);
        const hoursThisMonth = (timeAgg._sum.minutes || 0) / 60;
        const expensesThisMonth = expensesAgg._sum.amount ? Number(expensesAgg._sum.amount.toString()) : 0;
        const topCasesWithData = await this.prisma.case.findMany({
            where: { id: { in: topCases.map(t => t.caseId) } },
            select: { id: true, title: true, expedienteNumber: true },
        });
        const caseInfoById = new Map(topCasesWithData.map(c => [c.id, c]));
        const top = topCases.map(t => ({
            caseId: t.caseId,
            minutes: t._sum.minutes || 0,
            hours: (t._sum.minutes || 0) / 60,
            case: caseInfoById.get(t.caseId) || null,
        }));
        return { hoursThisMonth, expensesThisMonth, topCases: top };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatsService);
//# sourceMappingURL=stats.service.js.map