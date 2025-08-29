import { PrismaService } from '../prisma/prisma.service';
export declare class CasePartiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCase(orgId: string, caseId: string): Promise<{
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        caseId: string;
        identification: string | null;
        opposingLawyer: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    create(orgId: string, data: {
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
    update(orgId: string, id: string, data: Partial<{
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
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
