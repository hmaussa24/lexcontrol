import { WompiService } from './wompi.service';
export declare class BillingController {
    private readonly wompi;
    constructor(wompi: WompiService);
    acceptanceToken(): Promise<{
        acceptanceToken: string;
    }>;
    createPaymentSource(req: any, body: {
        customerEmail?: string;
        token: string;
        acceptanceToken: string;
        nickname?: string;
    }): Promise<{
        organizationId: string;
        type: string;
        id: string;
        provider: string;
        wompiPaymentSourceId: string;
        wompiCardToken: string | null;
        brand: string | null;
        last4: string | null;
        expMonth: number | null;
        expYear: number | null;
        status: import("@prisma/client").$Enums.PaymentMethodStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    startTrial(req: any, body: {
        planCode?: string;
        defaultPaymentMethodId?: string;
    }): Promise<{
        organizationId: string;
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        trialEndsAt: Date | null;
        defaultPaymentMethodId: string | null;
        planCode: string;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        cancelAtPeriodEnd: boolean;
        lastChargeAt: Date | null;
        lastChargeStatus: string | null;
        lastChargeError: string | null;
    }>;
    chargeNow(req: any, body: {
        amountCents?: number;
        currency?: string;
    }): Promise<{
        status: any;
    }>;
    runDue(): Promise<{
        count: number;
        results: any[];
    }>;
    me(req: any): Promise<{
        subscription: {
            organizationId: string;
            id: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            createdAt: Date;
            updatedAt: Date;
            trialEndsAt: Date | null;
            defaultPaymentMethodId: string | null;
            planCode: string;
            currentPeriodStart: Date | null;
            currentPeriodEnd: Date | null;
            cancelAtPeriodEnd: boolean;
            lastChargeAt: Date | null;
            lastChargeStatus: string | null;
            lastChargeError: string | null;
        } | null;
        paymentMethods: {
            organizationId: string;
            type: string;
            id: string;
            provider: string;
            wompiPaymentSourceId: string;
            wompiCardToken: string | null;
            brand: string | null;
            last4: string | null;
            expMonth: number | null;
            expYear: number | null;
            status: import("@prisma/client").$Enums.PaymentMethodStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
        trialActive: boolean | null;
        hasMethod: boolean;
        shouldRedirectToBilling: boolean;
    }>;
}
