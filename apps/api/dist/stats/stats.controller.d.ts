import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly stats;
    constructor(stats: StatsService);
    dashboard(req: any): Promise<{
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
