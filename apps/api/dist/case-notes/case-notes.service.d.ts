import { PrismaService } from '../prisma/prisma.service';
export declare class CaseNotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCase(orgId: string, caseId: string): Promise<{
        id: string;
        createdAt: Date;
        caseId: string;
        createdById: string | null;
        content: string;
    }[]>;
    create(orgId: string, userId: string, data: {
        caseId: string;
        content: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        caseId: string;
        createdById: string | null;
        content: string;
    }>;
    update(orgId: string, id: string, data: Partial<{
        content: string;
    }>): Promise<{
        id: string;
        createdAt: Date;
        caseId: string;
        createdById: string | null;
        content: string;
    }>;
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
