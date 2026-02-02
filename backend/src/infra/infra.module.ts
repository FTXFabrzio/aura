import { Module } from '@nestjs/common';
import { InfraService } from './infra.service';
import { InfraController } from './infra.controller';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [CryptoModule],
  providers: [InfraService],
  controllers: [InfraController],
  exports: [InfraService],
})
export class InfraModule {}
