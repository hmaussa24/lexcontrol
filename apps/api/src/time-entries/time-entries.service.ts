import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimeEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  async listByCase(orgId: string, caseId: string, filters?: { from?: Date; to?: Date; userId?: string; billable?: boolean }) {
    const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.timeEntry.findMany({
      where: {
        caseId,
        userId: filters?.userId || undefined,
        billable: typeof filters?.billable === 'boolean' ? filters!.billable : undefined,
        date: {
          gte: filters?.from,
          lte: filters?.to,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async create(orgId: string, data: { caseId: string; userId?: string; date: Date; minutes: number; description?: string; billable?: boolean; hourlyRate?: any }) {
    const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.timeEntry.create({ data });
  }

  async update(orgId: string, id: string, data: Partial<{ date: Date; minutes: number; description?: string; billable?: boolean; hourlyRate?: any; userId?: string }>) {
    const existing = await this.prisma.timeEntry.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Entrada de tiempo no encontrada');
    return this.prisma.timeEntry.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.prisma.timeEntry.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Entrada de tiempo no encontrada');
    await this.prisma.timeEntry.delete({ where: { id } });
    return { ok: true };
  }

  async summary(orgId: string, caseId: string, filters?: { from?: Date; to?: Date; userId?: string; billable?: boolean }) {
    const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    const where = {
      caseId,
      userId: filters?.userId || undefined,
      billable: typeof filters?.billable === 'boolean' ? filters!.billable : undefined,
      date: { gte: filters?.from, lte: filters?.to },
    } as any;
    const entries = await this.prisma.timeEntry.findMany({ where });
    const minutesTotal = entries.reduce((a, b) => a + (b.minutes || 0), 0);
    const minutesBillable = entries.filter(e => e.billable).reduce((a, b) => a + (b.minutes || 0), 0);
    return { minutesTotal, minutesBillable, hoursTotal: minutesTotal / 60, hoursBillable: minutesBillable / 60 };
  }
}


