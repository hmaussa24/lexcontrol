import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SUPABASE } from '../supabase/supabase.module';
import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = process.env.DOCUMENTS_BUCKET || 'documents';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService, @Inject(SUPABASE) private readonly supabase: SupabaseClient) {}

  async listByCase(orgId: string, caseId: string, filters?: { from?: Date; to?: Date }) {
    const kase = await this.prisma.case.findFirst({ where: { id: caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    return this.prisma.expense.findMany({ where: { caseId, date: { gte: filters?.from, lte: filters?.to } }, orderBy: { date: 'desc' } });
  }

  async create(orgId: string, data: { caseId: string; userId?: string; date: Date; concept: string; amount: any; currency?: string; notes?: string; receiptBase64?: string; receiptName?: string; receiptMime?: string }) {
    const kase = await this.prisma.case.findFirst({ where: { id: data.caseId, organizationId: orgId } });
    if (!kase) throw new NotFoundException('Caso no encontrado');
    let receiptKey: string | undefined;
    if (data.receiptBase64 && data.receiptName) {
      const buffer = Buffer.from(data.receiptBase64, 'base64');
      receiptKey = `expenses/${data.caseId}/${Date.now()}_${data.receiptName}`;
      await this.supabase.storage.from(BUCKET).upload(receiptKey, buffer, { contentType: data.receiptMime || 'application/octet-stream' });
    }
    return this.prisma.expense.create({ data: { caseId: data.caseId, userId: data.userId, date: data.date, concept: data.concept, amount: data.amount, currency: data.currency || 'COP', notes: data.notes, receiptKey } });
  }

  async update(orgId: string, id: string, data: Partial<{ date: Date; concept: string; amount: any; currency?: string; notes?: string }>) {
    const existing = await this.prisma.expense.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Gasto no encontrado');
    return this.prisma.expense.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    const existing = await this.prisma.expense.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!existing) throw new NotFoundException('Gasto no encontrado');
    await this.prisma.expense.delete({ where: { id } });
    return { ok: true };
  }

  async receiptSignedUrl(orgId: string, id: string) {
    const exp = await this.prisma.expense.findFirst({ where: { id, case: { organizationId: orgId } } });
    if (!exp) throw new NotFoundException('Gasto no encontrado');
    if (!exp.receiptKey) return { url: null };
    const { data, error } = await this.supabase.storage.from(BUCKET).createSignedUrl(exp.receiptKey, 900);
    if (error) throw error;
    return { url: data?.signedUrl };
  }
}


