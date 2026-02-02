import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
export declare class SubscriptionsService {
    private db;
    constructor(db: LibSQLDatabase<typeof schema>);
    findAll(): Promise<{
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
    create(data: {
        tenantId: number;
        planId: number;
        status?: 'active' | 'past_due' | 'canceled';
        expiresAt?: Date;
    }): Promise<{
        id: number;
        status: "active" | "past_due" | "canceled" | null;
        tenantId: number;
        planId: number;
        expiresAt: Date | null;
    }>;
    updateStatus(id: number, status: 'active' | 'past_due' | 'canceled'): Promise<import("@libsql/client", { with: { "resolution-mode": "import" } }).ResultSet>;
}
