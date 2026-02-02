import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
export declare class TenantsService {
    private db;
    constructor(db: LibSQLDatabase<typeof schema>);
    findAll(): Promise<{
        id: number;
        name: string;
        slug: string;
        createdAt: Date | null;
        domain: string;
        status: "active" | "suspended" | "trial" | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        slug: string;
        createdAt: Date | null;
        domain: string;
        status: "active" | "suspended" | "trial" | null;
    }>;
    create(data: {
        name: string;
        slug: string;
        domain: string;
        status?: 'active' | 'suspended' | 'trial';
    }): Promise<{
        id: number;
        name: string;
        slug: string;
        createdAt: Date | null;
        domain: string;
        status: "active" | "suspended" | "trial" | null;
    }>;
    getProducts(): Promise<{
        id: number;
        name: string;
        slug: string;
        apiKeySecret: string;
        createdAt: Date | null;
    }[]>;
}
