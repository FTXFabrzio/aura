import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { CryptoService } from './security/crypto.service';
import { ResolveController } from './controllers/v1/resolve.controller';
import { ResolveTenantUseCase } from '../application/use-cases/resolve-tenant.use-case';
import { TenantRepository } from '../domain/ports/tenant.repository.port';
import { TenantDrizzleRepository } from './adapters/persistence/tenant.drizzle.repository';

@Module({
  imports: [PersistenceModule],
  controllers: [ResolveController],
  providers: [
    CryptoService,
    ResolveTenantUseCase,
    {
      provide: TenantRepository,
      useClass: TenantDrizzleRepository,
    },
  ],
  exports: [CryptoService],
})
export class AuraModule {}
