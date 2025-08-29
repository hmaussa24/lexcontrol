import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaseNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async listByCase(orgId: string, caseId: string) {
    const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseNote.findMany({ where: { caseId }, orderBy: { createdAt: 'desc' } });
  }

  async create(orgId: string, userId: string, data: { caseId: string; content: string }) {
    const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseNote.create({ data: { ...data, createdById: userId } });
  }

  async update(orgId: string, id: string, data: Partial<{ content: string }>) {
    const existing = await this.prisma.caseNote.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Nota no encontrada');
    return this.prisma.caseNote.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.prisma.caseNote.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Nota no encontrada');
    await this.prisma.caseNote.delete({ where: { id } });
    return { ok: true };
  }
}


