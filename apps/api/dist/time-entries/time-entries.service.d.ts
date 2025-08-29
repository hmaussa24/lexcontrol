import { PrismaService } from '../prisma/prisma.service';
export declare class TimeEntriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCase(orgId: string, caseId: string, filters?: {
        from?: Date;
        to?: Date;
        userId?: string;
        billable?: boolean;
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
    }[]>;
    create(orgId: string, data: {
        caseId: string;
        userId?: string;
        date: Date;
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
    update(orgId: string, id: string, data: Partial<{
        date: Date;
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
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
    summary(orgId: string, caseId: string, filters?: {
        from?: Date;
        to?: Date;
        userId?: string;
        billable?: boolean;
    }): Promise<{
        minutesTotal: number;
        minutesBillable: number;
        hoursTotal: number;
        hoursBillable: number;
    }>;
}
