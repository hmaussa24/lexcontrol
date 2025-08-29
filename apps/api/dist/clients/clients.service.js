"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClientsService = class ClientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(orgId, query) {
        const where = {
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
        const sortField = ['name', 'createdAt', 'updatedAt', 'status'].includes(query?.sort || '') ? query.sort : 'name';
        const sortDir = (query?.dir === 'asc' || query?.dir === 'desc') ? query.dir : 'asc';
        return this.prisma.$transaction([
            this.prisma.client.count({ where }),
            this.prisma.client.findMany({ where, orderBy: { [sortField]: sortDir }, skip: (page - 1) * pageSize, take: pageSize }),
        ]).then(([total, data]) => ({ total, page, pageSize, data }));
    }
    get(orgId, id) {
        return this.prisma.client.findFirst({ where: { id, organizationId: orgId } });
    }
    create(orgId, data) {
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
    async update(orgId, id, data) {
        const existing = await this.get(orgId, id);
        if (!existing)
            throw new common_1.NotFoundException('Cliente no encontrado');
        return this.prisma.client.update({ where: { id }, data });
    }
    async remove(orgId, id) {
        const existing = await this.get(orgId, id);
        if (!existing)
            throw new common_1.NotFoundException('Cliente no encontrado');
        await this.prisma.client.delete({ where: { id } });
        return { ok: true };
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map