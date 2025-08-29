import { PrismaService } from '../prisma/prisma.service';
export declare class DeadlinesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCase(orgId: string, caseId: string): import("@prisma/client").Prisma.PrismaPromise<{
        type: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        title: string;
        caseId: string;
        dueAt: Date;
        priority: number | null;
        remindDays: number | null;
        completed: boolean;
        completedAt: Date | null;
        completedById: string | null;
    }[]>;
    upcoming(orgId: string, days?: number): import("@prisma/client").Prisma.PrismaPromise<{
        type: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        title: string;
        caseId: string;
        dueAt: Date;
        priority: number | null;
        remindDays: number | null;
        completed: boolean;
        completedAt: Date | null;
        completedById: string | null;
    }[]>;
    create(orgId: string, data: {
        caseId: string;
        title: string;
        dueAt: Date;
        type?: string;
        priority?: number;
        remindDays?: number;
        notes?: string;
    }): Promise<{
        type: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        title: string;
        caseId: string;
        dueAt: Date;
        priority: number | null;
        remindDays: number | null;
        completed: boolean;
        completedAt: Date | null;
        completedById: string | null;
    }>;
    update(orgId: string, id: string, data: Partial<{
        title: string;
        dueAt: Date;
        type?: string;
        priority?: number;
        remindDays?: number;
        completed?: boolean;
        notes?: string;
    }>): Promise<{
        type: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        title: string;
        caseId: string;
        dueAt: Date;
        priority: number | null;
        remindDays: number | null;
        completed: boolean;
        completedAt: Date | null;
        completedById: string | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
