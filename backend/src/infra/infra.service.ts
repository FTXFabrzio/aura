import { Injectable, Inject } from '@nestjs/common';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class InfraService {
  constructor(
    @Inject('DRIZZLE') private db: LibSQLDatabase<typeof schema>,
    private cryptoService: CryptoService,
  ) {}

  async saveConfig(tenantId: number, productId: number, dbUrl: string, dbToken: string) {
    const { encryptedData, iv } = this.cryptoService.encrypt(dbToken);
    
    // Verificar si existe para ese product + tenant
    const existing = await this.db.query.infraConfigs.findFirst({
      where: and(
        eq(schema.infraConfigs.tenantId, tenantId),
        eq(schema.infraConfigs.productId, productId)
      ),
    });

    if (existing) {
      await this.db.update(schema.infraConfigs)
        .set({ 
          dbUrl, 
          dbTokenEncrypted: encryptedData, 
          encryptionIv: iv 
        })
        .where(eq(schema.infraConfigs.id, existing.id))
        .run();
    } else {
      await this.db.insert(schema.infraConfigs)
        .values({
          tenantId,
          productId,
          dbUrl,
          dbTokenEncrypted: encryptedData,
          encryptionIv: iv,
        })
        .run();
    }
  }

  async findAll() {
    return this.db.query.infraConfigs.findMany({
      with: {
        tenant: true,
        product: true,
      }
    });
  }

  async testConnection(dbUrl: string, dbToken: string) {
    const { createClient } = await import('@libsql/client');
    const client = createClient({ url: dbUrl, authToken: dbToken });
    try {
      await client.execute('SELECT 1');
      return { success: true, message: 'Conexión exitosa' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  async getStats() {

    const tenants = await this.db.select().from(schema.tenants).all();
    const configs = await this.db.select().from(schema.infraConfigs).all();

    return {
      tenants: tenants.length,
      infraConfigs: configs.length,
    };
  }
}
