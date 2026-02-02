import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
export declare class PlansService {
    private db;
    constructor(db: LibSQLDatabase<typeof schema>);
    findAll(): Promise<{
        id: number;
        name: string;
        productId: number;
        priceCents: number;
        currency: string | null;
        product: {
            id: number;
            name: string;
            slug: string;
            apiKeySecret: string;
            createdAt: Date | null;
        };
    }[]>;
    findByProduct(productId: number): Promise<{
        id: number;
        name: string;
        productId: number;
        priceCents: number;
        currency: string | null;
    }[]>;
    create(data: {
        productId: number;
        name: string;
        priceCents: number;
        currency?: string;
    }): Promise<{
        id: number;
        name: string;
        productId: number;
        priceCents: number;
        currency: string | null;
    }>;
}
