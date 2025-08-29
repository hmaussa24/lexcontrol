import { CasePartiesService } from './case-parties.service';
export declare class CasePartiesController {
    private readonly service;
    constructor(service: CasePartiesService);
    list(req: any, caseId: string): Promise<{
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        caseId: string;
        identification: string | null;
        opposingLawyer: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    create(req: any, body: {
        caseId: string;
        type: string;
        name: string;
        identification?: string;
        opposingLawyer?: any;
    }): Promise<{
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        caseId: string;
        identification: string | null;
        opposingLawyer: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(req: any, id: string, body: Partial<{
        type: string;
        name: string;
        identification?: string;
        opposingLawyer?: any;
    }>): Promise<{
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        caseId: string;
        identification: string | null;
        opposingLawyer: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
}
