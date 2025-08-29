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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_module_1 = require("../supabase/supabase.module");
const BUCKET = process.env.DOCUMENTS_BUCKET || 'documents';
let ExpensesService = class ExpensesService {
    prisma;
    supabase;
    constructor(prisma, supabase) {
        this.prisma = prisma;
        this.supabase = supabase;
    }
    async listByCase(orgId, caseId, filters) {
        const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        return this.prisma.expense.findMany({ where: { caseId, date: { gte: filters?.from, lte: filters?.to } }, orderBy: { date: 'desc' } });
    }
    async create(orgId, data) {
        const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
        if (!kase)
            throw new common_1.NotFoundException('Caso no encontrado');
        let receiptKey;
        if (data.receiptBase64 && data.receiptName) {
            const buffer = Buffer.from(data.receiptBase64, 'base64');
            receiptKey = `expenses/${data.caseId}/${Date.now()}_${data.receiptName}`;
            await this.supabase.storage.from(BUCKET).upload(receiptKey, buffer, { contentType: data.receiptMime || 'application/octet-stream' });
        }
        return this.prisma.expense.create({ data: { caseId: data.caseId, userId: data.userId, date: data.date, concept: data.concept, amount: data.amount, currency: data.currency || 'COP', notes: data.notes, receiptKey } });
    }
    async update(orgId, id, data) {
        const existing = await this.prisma.expense.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Gasto no encontrado');
        return this.prisma.expense.update({ where: { id }, data });
    }
    async remove(orgId, id) {
        const existing = await this.prisma.expense.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!existing)
            throw new common_1.NotFoundException('Gasto no encontrado');
        await this.prisma.expense.delete({ where: { id } });
        return { ok: true };
    }
    async receiptSignedUrl(orgId, id) {
        const exp = await this.prisma.expense.findFirst({ where: { id, case: { organizationId: orgId } } });
        if (!exp)
            throw new common_1.NotFoundException('Gasto no encontrado');
        if (!exp.receiptKey)
            return { url: null };
        const { data, error } = await this.supabase.storage.from(BUCKET).createSignedUrl(exp.receiptKey, 900);
        if (error)
            throw error;
        return { url: data?.signedUrl };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(supabase_module_1.SUPABASE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Function])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map