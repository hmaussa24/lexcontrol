import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HearingsService {
  constructor(private readonly prisma: PrismaService) {}

  listByCase(orgId: string, caseId: string) {
    return this.prisma.hearing.findMany({ where: { caseId, case: { organizationId: orgId } }, orderBy: { date: 'asc' } });
  }

  upcoming(orgId: string, days = 30) {
    const now = new Date();
    const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return this.prisma.hearing.findMany({
      where: { case: { organizationId: orgId }, date: { gte: now, lte: until } },
      orderBy: { date: 'asc' },
    });
  }

  async create(orgId: string, data: { caseId: string; date: Date; time?: string; location?: string; type?: string; attendees?: any; result?: string; notes?: string }) {
    const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.hearing.create({ data });
  }

  async update(orgId: string, id: string, data: Partial<{ date: Date; time?: string; location?: string; type?: string; attendees?: any; result?: string; notes?: string }>) {
    const existing = await this.prisma.hearing.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Audiencia no encontrada');
    return this.prisma.hearing.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.prisma.hearing.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Audiencia no encontrada');
    await this.prisma.hearing.delete({ where: { id } });
    return { ok: true };
  }
}


