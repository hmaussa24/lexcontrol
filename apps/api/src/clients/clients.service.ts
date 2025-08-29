import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  list(orgId: string, query?: { q?: string; type?: string; status?: string; page?: number; pageSize?: number; sort?: string; dir?: 'asc' | 'desc' }) {
    const where: any = {
      organizationId: orgId,
      type: query?.type || undefined,
      status: query?.status || undefined,
      OR: query?.q
        ? [
            { name: { contains: query.q, mode: 'insensitive' } },
            { identification: { contains: query.q, mode: 'insensitive' } },
            { email: { contains: query.q, mode: 'insensitive' } },
            { phones: { has: query.q } },
          ]
        : undefined,
    };
    const page = query?.page && query.page > 0 ? query.page : 1;
    const pageSize = query?.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const sortField = ['name','createdAt','updatedAt','status'].includes(query?.sort || '') ? (query!.sort as any) : 'name';
    const sortDir = (query?.dir === 'asc' || query?.dir === 'desc') ? query!.dir : 'asc';
    return this.prisma.$transaction([
      this.prisma.client.count({ where }),
      this.prisma.client.findMany({ where, orderBy: { [sortField]: sortDir }, skip: (page - 1) * pageSize, take: pageSize }),
    ]).then(([total, data]) => ({ total, page, pageSize, data }));
  }

  get(orgId: string, id: string) {
    return this.prisma.client.findFirst({ where: { id, organizationId: orgId } });
  }

  create(orgId: string, data: { name: string; type: string; identification?: string; email?: string; phones?: string[]; addressLine?: string; city?: string; state?: string; country?: string; postalCode?: string; contact?: any; responsibleLawyerId?: string; tags?: string[] }) {
    return this.prisma.client.create({
      data: {
        organizationId: orgId,
        name: data.name,
        type: data.type,
        identification: data.identification,
        email: data.email,
        phones: data.phones || [],
        addressLine: data.addressLine,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        contact: data.contact,
        status: 'ACTIVO',
        responsibleLawyerId: data.responsibleLawyerId,
        tags: data.tags || [],
      },
    });
  }

  async update(orgId: string, id: string, data: Partial<{ name: string; type: string; identification?: string; email?: string; phones?: string[]; addressLine?: string; city?: string; state?: string; country?: string; postalCode?: string; contact?: any; status?: string; responsibleLawyerId?: string; tags?: string[] }>) {
    const existing = await this.get(orgId, id);
    if (!existing) throw new NotFoundException('Cliente no encontrado');
    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.get(orgId, id);
    if (!existing) throw new NotFoundException('Cliente no encontrado');
    await this.prisma.client.delete({ where: { id } });
    return { ok: true };
  }
}


