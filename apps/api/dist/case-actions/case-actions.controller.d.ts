import { CaseActionsService } from './case-actions.service';
export declare class CaseActionsController {
    private readonly service;
    constructor(service: CaseActionsService);
    list(req: any, caseId: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        caseId: string;
        date: Date;
        documentId: string | null;
        summary: string;
    }[]>;
    create(req: any, body: {
        caseId: string;
        date: string;
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
    update(req: any, id: string, body: Partial<{
        date: string;
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
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
}
