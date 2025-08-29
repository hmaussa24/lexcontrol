import { PrismaService } from '../prisma/prisma.service';
export declare class StatsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    dashboard(orgId: string): Promise<{
        hoursThisMonth: number;
        expensesThisMonth: number;
        topCases: {
            caseId: string;
            minutes: number;
            hours: number;
            case: {
                id: string;
                title: string;
                expedienteNumber: string;
            } | null;
        }[];
    }>;
}
