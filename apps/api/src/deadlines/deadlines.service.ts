import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeadlinesService {
  constructor(private readonly prisma: PrismaService) {}

  listByCase(orgId: string, caseId: string) {
    return this.prisma.deadline.findMany({
      where: { caseId, case: { organizationId: orgId } },
      orderBy: { dueAt: 'asc' },
    });
  }

  upcoming(orgId: string, days = 30) {
    const now = new Date();
    const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return this.prisma.deadline.findMany({
      where: {
        case: { organizationId: orgId },
        dueAt: { gte: now, lte: until },
        completed: false,
      },
      orderBy: { dueAt: 'asc' },
    });
  }

  async create(orgId: string, data: { caseId: string; title: string; dueAt: Date; type?: string; priority?: number; remindDays?: number; notes?: string }) {
    // Validar que el caso pertenezca a la organización
    const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.deadline.create({
      data: {
        caseId: data.caseId,
        title: data.title,
        dueAt: data.dueAt,
        type: data.type,
        priority: data.priority,
        remindDays: data.remindDays,
        notes: data.notes,
      },
    });
  }

  async update(orgId: string, id: string, data: Partial<{ title: string; dueAt: Date; type?: string; priority?: number; remindDays?: number; completed?: boolean; notes?: string }>) {
    const existing = await this.prisma.deadline.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Plazo no encontrado');
    return this.prisma.deadline.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.prisma.deadline.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Plazo no encontrado');
    await this.prisma.deadline.delete({ where: { id } });
    return { ok: true };
  }
}


