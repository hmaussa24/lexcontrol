import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly service;
    constructor(service: ExpensesService);
    list(req: any, caseId: string, from?: string, to?: string): Promise<{
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
    create(req: any, body: {
        caseId: string;
        userId?: string;
        date: string;
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
    update(req: any, id: string, body: Partial<{
        date: string;
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
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
    receipt(req: any, id: string): Promise<{
        url: null;
    } | {
        url: string;
    }>;
}
