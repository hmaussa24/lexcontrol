import { PrismaService } from '../prisma/prisma.service';
type CreatePaymentSourceInput = {
    customerEmail: string;
    token: string;
    acceptanceToken: string;
    nickname?: string;
    organizationId: string;
};
export declare class WompiService {
    private readonly prisma;
    private readonly http;
    private readonly publicKey;
    private readonly privateKey;
    constructor(prisma: PrismaService);
    getAcceptanceToken(): Promise<string>;
    createPaymentSource(input: CreatePaymentSourceInput): Promise<{
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
    chargeMonthlySubscription(organizationId: string, amountCents?: number, currency?: string): Promise<{
        status: any;
    }>;
    runDueCharges(): Promise<{
        count: number;
        results: any[];
    }>;
    startTrialSubscription(organizationId: string, planCode?: string, defaultPaymentMethodId?: string): Promise<{
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
    getOrganizationSubscription(organizationId: string): Promise<{
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
    } | null>;
    listPaymentMethods(organizationId: string): Promise<{
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
    }[]>;
    handleWebhook(payload: any): Promise<void>;
}
export {};
