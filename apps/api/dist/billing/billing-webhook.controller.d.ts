import { WompiService } from './wompi.service';
export declare class BillingWebhookController {
    private readonly wompi;
    constructor(wompi: WompiService);
    webhook(payload: any): Promise<{
        ok: boolean;
    }>;
}
