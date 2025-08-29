import { TimeEntriesService } from './time-entries.service';
export declare class TimeEntriesController {
    private readonly service;
    constructor(service: TimeEntriesService);
    list(req: any, caseId: string, from?: string, to?: string, userId?: string, billable?: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        hourlyRate: import("@prisma/client/runtime/library").Decimal | null;
        caseId: string;
        date: Date;
        minutes: number;
        billable: boolean;
        userId: string | null;
    }[]>;
    summary(req: any, caseId: string, from?: string, to?: string): Promise<{
        minutesTotal: number;
        minutesBillable: number;
        hoursTotal: number;
        hoursBillable: number;
    }>;
    create(req: any, body: {
        caseId: string;
        userId?: string;
        date: string;
        minutes: number;
        description?: string;
        billable?: boolean;
        hourlyRate?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        hourlyRate: import("@prisma/client/runtime/library").Decimal | null;
        caseId: string;
        date: Date;
        minutes: number;
        billable: boolean;
        userId: string | null;
    }>;
    update(req: any, id: string, body: Partial<{
        date: string;
        minutes: number;
        description?: string;
        billable?: boolean;
        hourlyRate?: any;
        userId?: string;
    }>): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        hourlyRate: import("@prisma/client/runtime/library").Decimal | null;
        caseId: string;
        date: Date;
        minutes: number;
        billable: boolean;
        userId: string | null;
    }>;
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
}
