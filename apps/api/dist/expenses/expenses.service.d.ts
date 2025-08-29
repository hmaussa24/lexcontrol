import { PrismaService } from '../prisma/prisma.service';
import type { SupabaseClient } from '@supabase/supabase-js';
export declare class ExpensesService {
    private readonly prisma;
    private readonly supabase;
    constructor(prisma: PrismaService, supabase: SupabaseClient);
    listByCase(orgId: string, caseId: string, filters?: {
        from?: Date;
        to?: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        currency: string;
        notes: string | null;
        caseId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        userId: string | null;
        concept: string;
        receiptKey: string | null;
    }[]>;
    create(orgId: string, data: {
        caseId: string;
        userId?: string;
        date: Date;
        concept: string;
        amount: any;
        currency?: string;
        notes?: string;
        receiptBase64?: string;
        receiptName?: string;
        receiptMime?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        currency: string;
        notes: string | null;
        caseId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        userId: string | null;
        concept: string;
        receiptKey: string | null;
    }>;
    update(orgId: string, id: string, data: Partial<{
        date: Date;
        concept: string;
        amount: any;
        currency?: string;
        notes?: string;
    }>): Promise<{
        id: string;
        createdAt: Date;
        currency: string;
        notes: string | null;
        caseId: string;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        userId: string | null;
        concept: string;
        receiptKey: string | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
    receiptSignedUrl(orgId: string, id: string): Promise<{
        url: null;
    } | {
        url: string;
    }>;
}
