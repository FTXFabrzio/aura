import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { CryptoService } from '../crypto/crypto.service';
export declare class DiscoveryService {
    private db;
    private cryptoService;
    constructor(db: LibSQLDatabase<typeof schema>, cryptoService: CryptoService);
    resolveDomain(identifier: string, productSecret: string): Promise<{
        tenantId: number;
        productId: number;
        dbUrl: string;
        dbToken: string;
    }>;
}
