import { Injectable, NotFoundException, ForbiddenException, Inject, InternalServerErrorException } from '@nestjs/common';
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

    // 3. Verificar suscripción activa
    const subscription = await this.db.query.subscriptions.findFirst({
      where: and(
        eq(schema.subscriptions.tenantId, tenantId),
        eq(schema.subscriptions.status, 'active'),
      ),
      with: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new ForbiddenException(`El cliente '${identifier}' no tiene una suscripción activa en Aura.`);
    }

    if (!subscription.plan) {
      throw new ForbiddenException(`Error de integridad: La suscripción no tiene un Plan asociado.`);
    }

    if (subscription.plan.productId !== product.id) {
      throw new ForbiddenException(
        `El cliente tiene una suscripción activa, pero es para otro producto, no para ${product.name}.`,
      );
    }

    // 4. Obtener configuración de infraestructura
    const infra = await this.db.query.infraConfigs.findFirst({
      where: and(
        eq(schema.infraConfigs.tenantId, tenantId),
        eq(schema.infraConfigs.productId, product.id),
      ),
    });

    if (!infra) {
      throw new NotFoundException(
        `Aura no tiene registrada ninguna base de datos para ${product.name} en esta empresa. Ve a 'Config. Infra'.`,
      );
    }

    // 5. Descifrar el token con manejo de errores
    try {
      const decryptedToken = this.cryptoService.decrypt(infra.dbTokenEncrypted, infra.encryptionIv);

      return {
        tenantId,
        productId: product.id,
        dbUrl: infra.dbUrl,
        dbToken: decryptedToken,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al descifrar el token. Es probable que la AURA_MASTER_KEY haya cambiado desde que se guardó el blindaje.',
      );
    }
  }

}
