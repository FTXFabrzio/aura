import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
export declare class ProductsService {
    private db;
    constructor(db: LibSQLDatabase<typeof schema>);
    findAll(): Promise<{
        id: number;
        name: string;
        slug: string;
        apiKeySecret: string;
        createdAt: Date | null;
    }[]>;
    create(data: {
        name: string;
        slug: string;
        apiKeySecret: string;
    }): Promise<{
        id: number;
        name: string;
        slug: string;
        apiKeySecret: string;
        createdAt: Date | null;
    }>;
}
