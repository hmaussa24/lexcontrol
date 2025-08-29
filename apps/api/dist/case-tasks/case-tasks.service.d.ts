import { PrismaService } from '../prisma/prisma.service';
export declare class CaseTasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCase(orgId: string, caseId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        caseId: string;
        dueAt: Date | null;
        priority: number | null;
        assigneeId: string | null;
        order: number | null;
    }[]>;
    create(orgId: string, data: {
        caseId: string;
        title: string;
        description?: string;
        status?: string;
        priority?: number;
        dueAt?: Date;
        assigneeId?: string;
    }): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        caseId: string;
        dueAt: Date | null;
        priority: number | null;
        assigneeId: string | null;
        order: number | null;
    }>;
    update(orgId: string, id: string, data: Partial<{
        title: string;
        description?: string;
        status?: string;
        priority?: number;
        dueAt?: Date;
        assigneeId?: string;
        order?: number;
    }>): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        caseId: string;
        dueAt: Date | null;
        priority: number | null;
        assigneeId: string | null;
        order: number | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
    summary(orgId: string): Promise<{
        pending: number;
        dueSoon: number;
    }>;
}
