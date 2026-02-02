import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class DiscoveryService {
  constructor(
    @Inject('DRIZZLE') private db: LibSQLDatabase<typeof schema>,
    private cryptoService: CryptoService,
  ) {}

  async resolveDomain(identifier: string, productSecret: string) {
    // 1. Validar el secreto del producto
    const product = await this.db.query.products.findFirst({
      where: eq(schema.products.apiKeySecret, productSecret),
    });

    if (!product) {
      throw new ForbiddenException('Invalid X-AURA-SECRET');
    }

    // 2. Buscar el Tenant por Dominio (@identificador)
    const tenant = await this.db.query.tenants.findFirst({
      where: eq(schema.tenants.domain, identifier),
    });

    if (!tenant) {
      throw new NotFoundException(`Empresa con slug '${identifier}' no encontrada.`);
    }

    const tenantId = tenant.id;

    // 3. Verificar suscripción activa PARA ESTE PRODUCTO
    const subscription = await this.db.query.subscriptions.findFirst({
      where: and(
        eq(schema.subscriptions.tenantId, tenantId),
        eq(schema.subscriptions.status, 'active')
      ),
      with: {
        plan: true, // Traer el plan para verificar el productId
      },
    });

    if (!subscription) {
      throw new ForbiddenException(`El cliente no tiene una suscripción activa.`);
    }

    // 3.1 Validar que el plan de la suscripción pertenezca al producto correcto
    if (subscription.plan.productId !== product.id) {
      throw new ForbiddenException(
        `El cliente no tiene una suscripción activa para el producto ${product.name}.`
      );
    }


    // 4. Obtener configuración de infraestructura
    const infra = await this.db.query.infraConfigs.findFirst({
      where: and(
        eq(schema.infraConfigs.tenantId, tenantId),
        eq(schema.infraConfigs.productId, product.id)
      ),
    });

    if (!infra) {
      throw new NotFoundException(`Configuración de infraestructura no encontrada.`);
    }

    // 5. Descifrar el token
    const decryptedToken = this.cryptoService.decrypt(infra.dbTokenEncrypted, infra.encryptionIv);

    // 6. Entregar JSON final
    return {
      tenantId,
      productId: product.id,
      dbUrl: infra.dbUrl,
      dbToken: decryptedToken,
    };
  }

}
