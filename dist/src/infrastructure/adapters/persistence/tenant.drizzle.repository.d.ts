import { TenantRepository, TenantResolution } from '../../../domain/ports/tenant.repository.port';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../../persistence/drizzle/schema';
import { CryptoService } from '../../security/crypto.service';
export declare class TenantDrizzleRepository implements TenantRepository {
    private db;
    private cryptoService;
    constructor(db: LibSQLDatabase<typeof schema>, cryptoService: CryptoService);
    resolveBySlug(slug: string, productSecret: string): Promise<TenantResolution | null>;
}
