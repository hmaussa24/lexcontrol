import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(orgId: string) {
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
}


