import { PrismaService } from '../prisma/prisma.service';
export declare class CaseAssignmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCase(orgId: string, caseId: string): Promise<{
        id: string;
        role: string;
        caseId: string;
        userId: string;
        since: Date;
        until: Date | null;
    }[]>;
    create(orgId: string, data: {
        caseId: string;
        userId: string;
        role: string;
        since?: Date;
        until?: Date;
    }): Promise<{
        id: string;
        role: string;
        caseId: string;
        userId: string;
        since: Date;
        until: Date | null;
    }>;
    update(orgId: string, id: string, data: Partial<{
        role: string;
        since?: Date;
        until?: Date;
    }>): Promise<{
        id: string;
        role: string;
        caseId: string;
        userId: string;
        since: Date;
        until: Date | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
