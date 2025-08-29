import { CaseNotesService } from './case-notes.service';
export declare class CaseNotesController {
    private readonly service;
    constructor(service: CaseNotesService);
    list(req: any, caseId: string): Promise<{
        id: string;
        createdAt: Date;
        caseId: string;
        createdById: string | null;
        content: string;
    }[]>;
    create(req: any, body: {
        caseId: string;
        content: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        caseId: string;
        createdById: string | null;
        content: string;
    }>;
    update(req: any, id: string, body: Partial<{
        content: string;
    }>): Promise<{
        id: string;
        createdAt: Date;
        caseId: string;
        createdById: string | null;
        content: string;
    }>;
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
}
