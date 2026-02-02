import { Inject, Injectable } from '@nestjs/common';
import { TenantRepository, TenantResolution } from '../../../domain/ports/tenant.repository.port';
import { DRIZZLE_PROVIDER } from '../../persistence/drizzle/drizzle.provider';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../../persistence/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { CryptoService } from '../../security/crypto.service';

@Injectable()
export class TenantDrizzleRepository implements TenantRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private db: LibSQLDatabase<typeof schema>,
    private cryptoService: CryptoService,
  ) {}

  async resolveBySlug(slug: string, productSecret: string): Promise<TenantResolution | null> {
    const product = await this.db.query.products.findFirst({
      where: eq(schema.products.apiKeySecret, productSecret),
    });

    if (!product) return null;

    const tenant = await this.db.query.tenants.findFirst({
      where: eq(schema.tenants.slug, slug),
    });

    if (!tenant || tenant.status !== 'active') return null;

    const subscription = await this.db.query.subscriptions.findFirst({
      where: and(
        eq(schema.subscriptions.tenantId, tenant.id),
        eq(schema.subscriptions.productId, product.id),
        eq(schema.subscriptions.status, 'active'),
      ),
    });

    if (!subscription) return null;

    const infra = await this.db.query.infraConfigs.findFirst({
      where: and(
        eq(schema.infraConfigs.tenantId, tenant.id),
        eq(schema.infraConfigs.productId, product.id),
      ),
    });

    if (!infra) return null;

    const dbToken = this.cryptoService.decrypt(infra.dbTokenEncrypted, infra.encryptionIv);

    return {
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantSlug: tenant.slug,
      infra: {
        dbUrl: infra.dbUrl,
        dbToken: dbToken,
      },
    };
  }
}
