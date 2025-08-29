import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CasePartiesService {
  constructor(private readonly prisma: PrismaService) {}

  async listByCase(orgId: string, caseId: string) {
    const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseParty.findMany({ where: { caseId }, orderBy: { name: 'asc' } });
  }

  async create(orgId: string, data: { caseId: string; type: string; name: string; identification?: string; opposingLawyer?: any }) {
    const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.caseParty.create({
      data: {
        caseId: data.caseId,
        type: data.type,
        name: data.name,
        identification: data.identification,
        opposingLawyer: data.opposingLawyer,
      },
    });
  }

  async update(orgId: string, id: string, data: Partial<{ type: string; name: string; identification?: string; opposingLawyer?: any }>) {
    const existing = await this.prisma.caseParty.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Parte no encontrada');
    return this.prisma.caseParty.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.prisma.caseParty.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Parte no encontrada');
    await this.prisma.caseParty.delete({ where: { id } });
    return { ok: true };
  }
}


