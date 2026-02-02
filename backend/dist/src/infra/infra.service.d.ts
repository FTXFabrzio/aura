import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { CryptoService } from '../crypto/crypto.service';
export declare class InfraService {
    private db;
    private cryptoService;
    constructor(db: LibSQLDatabase<typeof schema>, cryptoService: CryptoService);
    saveConfig(tenantId: number, productId: number, dbUrl: string, dbToken: string): Promise<void>;
    findAll(): Promise<{
        id: number;
        tenantId: number;
        productId: number;
        dbUrl: string;
        dbTokenEncrypted: string;
        encryptionIv: string;
        tenant: {
            id: number;
            name: string;
            slug: string;
            createdAt: Date | null;
            domain: string;
            status: "active" | "suspended" | "trial" | null;
        };
        product: {
            id: number;
            name: string;
            slug: string;
            apiKeySecret: string;
            createdAt: Date | null;
        };
    }[]>;
    testConnection(dbUrl: string, dbToken: string): Promise<{
        success: boolean;
        message: any;
    }>;
    getStats(): Promise<{
        tenants: number;
        infraConfigs: number;
    }>;
}
