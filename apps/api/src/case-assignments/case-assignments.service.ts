import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaseAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByCase(orgId: string, caseId: string) {
    const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseAssignment.findMany({ where: { caseId }, orderBy: { since: 'desc' } });
  }

  async create(orgId: string, data: { caseId: string; userId: string; role: string; since?: Date; until?: Date }) {
    const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseAssignment.create({ data });
  }

  async update(orgId: string, id: string, data: Partial<{ role: string; since?: Date; until?: Date }>) {
    const existing = await this.prisma.caseAssignment.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Asignación no encontrada');
    return this.prisma.caseAssignment.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.prisma.caseAssignment.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Asignación no encontrada');
    await this.prisma.caseAssignment.delete({ where: { id } });
    return { ok: true };
  }
}


