import { HearingsService } from './hearings.service';
export declare class HearingsController {
    private readonly hearings;
    constructor(hearings: HearingsService);
    upcoming(req: any, days?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    listByCase(req: any, caseId: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    create(req: any, body: {
        caseId: string;
        date: string;
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
    update(req: any, id: string, body: Partial<{
        date: string;
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
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
}
