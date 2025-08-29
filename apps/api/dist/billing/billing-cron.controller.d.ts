import { WompiService } from './wompi.service';
export declare class BillingCronController {
    private readonly wompi;
    constructor(wompi: WompiService);
    run(key?: string): Promise<{
        count: number;
        results: any[];
    }>;
}
