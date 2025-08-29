import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(orgId: string, query?: { q?: string; status?: string; clientId?: string; processType?: string; page?: number; pageSize?: number; sort?: string; dir?: string }) {
    const where: any = {
      organizationId: orgId,
      status: query?.status as any | undefined,
      clientId: query?.clientId || undefined,
      processType: (query?.processType as any) || undefined,
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
    const sortField = ['updatedAt','expedienteNumber','title'].includes(query?.sort || '') ? (query!.sort as any) : 'updatedAt';
    const sortDir = (query?.dir === 'asc' || query?.dir === 'desc') ? query!.dir : 'desc';
    const [total, data] = await Promise.all([
      this.prisma.case.count({ where }),
      this.prisma.case.findMany({ where, orderBy: { [sortField]: sortDir }, skip: (page - 1) * pageSize, take: pageSize }),
    ]);
    return { total, page, pageSize, data };
  }

  get(orgId: string, id: string) {
    return this.prisma.case.findFirst({ where: { id, organizationId: orgId } });
  }

  async create(orgId: string, data: { expedienteNumber: string; processType: string; title: string; description?: string; clientId: string; court?: string; jurisdiction?: string; responsibleLawyerId?: string }) {
    return this.prisma.case.create({
      data: {
        organizationId: orgId,
        expedienteNumber: data.expedienteNumber,
        processType: data.processType as any,
        title: data.title,
        description: data.description,
        clientId: data.clientId,
        court: data.court,
        jurisdiction: data.jurisdiction,
        responsibleLawyerId: data.responsibleLawyerId,
      },
    });
  }

  async update(orgId: string, id: string, data: Partial<{ processType: string; title: string; description?: string; status: string; court?: string; jurisdiction?: string; responsibleLawyerId?: string }>) {
    const existing = await this.get(orgId, id);
    if (!existing) throw new NotFoundException('Caso no encontrado');
    return this.prisma.case.update({
      where: { id },
      data: {
        processType: data.processType as any,
        title: data.title,
        description: data.description,
        status: data.status as any,
        court: data.court,
        jurisdiction: data.jurisdiction,
        responsibleLawyerId: data.responsibleLawyerId,
      },
    });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.get(orgId, id);
    if (!existing) throw new NotFoundException('Caso no encontrado');
    await this.prisma.case.delete({ where: { id } });
    return { ok: true };
  }

  async summary(orgId: string, id: string) {
    const kase = await this.get(orgId, id);
    if (!kase) throw new NotFoundException('Caso no encontrado');
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
}


