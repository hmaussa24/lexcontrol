import { CaseTasksService } from './case-tasks.service';
export declare class CaseTasksController {
    private readonly service;
    constructor(service: CaseTasksService);
    list(req: any, caseId: string): Promise<{
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
    create(req: any, body: {
        caseId: string;
        title: string;
        description?: string;
        status?: string;
        priority?: number;
        dueAt?: string;
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
    update(req: any, id: string, body: Partial<{
        title: string;
        description?: string;
        status?: string;
        priority?: number;
        dueAt?: string;
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
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
    summary(req: any): Promise<{
        pending: number;
        dueSoon: number;
    }>;
}
