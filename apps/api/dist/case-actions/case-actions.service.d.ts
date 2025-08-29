import { PrismaService } from '../prisma/prisma.service';
export declare class CaseActionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCase(orgId: string, caseId: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        caseId: string;
        date: Date;
        documentId: string | null;
        summary: string;
    }[]>;
    create(orgId: string, data: {
        caseId: string;
        date: Date;
        type: string;
        summary: string;
        documentId?: string;
    }): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        caseId: string;
        date: Date;
        documentId: string | null;
        summary: string;
    }>;
    update(orgId: string, id: string, data: Partial<{
        date: Date;
        type: string;
        summary: string;
        documentId?: string;
    }>): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        caseId: string;
        date: Date;
        documentId: string | null;
        summary: string;
    }>;
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
