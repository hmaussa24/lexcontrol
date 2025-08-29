import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaseActionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByCase(orgId: string, caseId: string) {
    const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseAction.findMany({ where: { caseId }, orderBy: { date: 'desc' } });
  }

  async create(orgId: string, data: { caseId: string; date: Date; type: string; summary: string; documentId?: string }) {
    const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseAction.create({ data });
  }

  async update(orgId: string, id: string, data: Partial<{ date: Date; type: string; summary: string; documentId?: string }>) {
    const existing = await this.prisma.caseAction.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Actuación no encontrada');
    return this.prisma.caseAction.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.prisma.caseAction.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Actuación no encontrada');
    await this.prisma.caseAction.delete({ where: { id } });
    return { ok: true };
  }
}


