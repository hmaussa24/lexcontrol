import { DeadlinesService } from './deadlines.service';
export declare class DeadlinesController {
    private readonly deadlines;
    constructor(deadlines: DeadlinesService);
    upcoming(req: any, days?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    listByCase(req: any, caseId: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    create(req: any, body: {
        caseId: string;
        title: string;
        dueAt: string;
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
    update(req: any, id: string, body: Partial<{
        title: string;
        dueAt: string;
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
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
}
