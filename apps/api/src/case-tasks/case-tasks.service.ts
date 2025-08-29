import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaseTasksService {
  constructor(private readonly prisma: PrismaService) {}

  async listByCase(orgId: string, caseId: string) {
    const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseTask.findMany({ where: { caseId }, orderBy: [{ status: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }] });
  }

  async create(orgId: string, data: { caseId: string; title: string; description?: string; status?: string; priority?: number; dueAt?: Date; assigneeId?: string }) {
    const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseTask.create({ data: { ...data, status: (data.status as any) ?? 'TODO' } as any });
  }

  async update(orgId: string, id: string, data: Partial<{ title: string; description?: string; status?: string; priority?: number; dueAt?: Date; assigneeId?: string; order?: number }>) {
    const existing = await this.prisma.caseTask.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Tarea no encontrada');
    return this.prisma.caseTask.update({ where: { id }, data: data as any });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.prisma.caseTask.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Tarea no encontrada');
    await this.prisma.caseTask.delete({ where: { id } });
    return { ok: true };
  }

  async summary(orgId: string) {
    const now = new Date();
    const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const [pending, dueSoon] = await Promise.all([
      this.prisma.caseTask.count({ where: { case: { organizationId: orgId }, status: { in: ['TODO', 'IN_PROGRESS'] } } }),
      this.prisma.caseTask.count({ where: { case: { organizationId: orgId }, status: { not: 'DONE' }, dueAt: { lte: soon } } }),
    ]);
    return { pending, dueSoon };
  }
}


