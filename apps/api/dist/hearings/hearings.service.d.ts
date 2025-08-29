import { PrismaService } from '../prisma/prisma.service';
export declare class HearingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCase(orgId: string, caseId: string): import("@prisma/client").Prisma.PrismaPromise<{
        type: string | null;
        result: string | null;
        id: string;
        createdAt: Date;
        notes: string | null;
        caseId: string;
        date: Date;
        time: string | null;
        location: string | null;
        attendees: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    upcoming(orgId: string, days?: number): import("@prisma/client").Prisma.PrismaPromise<{
        type: string | null;
        result: string | null;
        id: string;
        createdAt: Date;
        notes: string | null;
        caseId: string;
        date: Date;
        time: string | null;
        location: string | null;
        attendees: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    create(orgId: string, data: {
        caseId: string;
        date: Date;
        time?: string;
        location?: string;
        type?: string;
        attendees?: any;
        result?: string;
        notes?: string;
    }): Promise<{
        type: string | null;
        result: string | null;
        id: string;
        createdAt: Date;
        notes: string | null;
        caseId: string;
        date: Date;
        time: string | null;
        location: string | null;
        attendees: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(orgId: string, id: string, data: Partial<{
        date: Date;
        time?: string;
        location?: string;
        type?: string;
        attendees?: any;
        result?: string;
        notes?: string;
    }>): Promise<{
        type: string | null;
        result: string | null;
        id: string;
        createdAt: Date;
        notes: string | null;
        caseId: string;
        date: Date;
        time: string | null;
        location: string | null;
        attendees: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
