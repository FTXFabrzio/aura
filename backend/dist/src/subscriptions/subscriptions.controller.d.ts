import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    getSubscriptions(): Promise<{
        id: number;
        status: "active" | "past_due" | "canceled" | null;
        tenantId: number;
        planId: number;
        expiresAt: Date | null;
        tenant: {
            id: number;
            name: string;
            slug: string;
            createdAt: Date | null;
            domain: string;
            status: "active" | "suspended" | "trial" | null;
        };
        plan: {
            id: number;
            name: string;
            productId: number;
            priceCents: number;
            currency: string | null;
        };
    }[]>;
    createSubscription(body: {
        tenantId: number;
        planId: number;
        status?: any;
        expiresAt?: any;
    }): Promise<{
        id: number;
        status: "active" | "past_due" | "canceled" | null;
        tenantId: number;
        planId: number;
        expiresAt: Date | null;
    }>;
    updateStatus(id: number, status: any): Promise<import("@libsql/client", { with: { "resolution-mode": "import" } }).ResultSet>;
}
