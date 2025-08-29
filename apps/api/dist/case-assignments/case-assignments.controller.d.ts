import { CaseAssignmentsService } from './case-assignments.service';
export declare class CaseAssignmentsController {
    private readonly service;
    constructor(service: CaseAssignmentsService);
    list(req: any, caseId: string): Promise<{
        id: string;
        role: string;
        caseId: string;
        userId: string;
        since: Date;
        until: Date | null;
    }[]>;
    create(req: any, body: {
        caseId: string;
        userId: string;
        role: string;
        since?: string;
        until?: string;
    }): Promise<{
        id: string;
        role: string;
        caseId: string;
        userId: string;
        since: Date;
        until: Date | null;
    }>;
    update(req: any, id: string, body: Partial<{
        role: string;
        since?: string;
        until?: string;
    }>): Promise<{
        id: string;
        role: string;
        caseId: string;
        userId: string;
        since: Date;
        until: Date | null;
    }>;
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
}
