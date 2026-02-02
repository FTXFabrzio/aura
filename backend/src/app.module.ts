import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DbModule } from './db/db.module';
import { CryptoModule } from './crypto/crypto.module';
import { TenantsModule } from './tenants/tenants.module';
import { InfraModule } from './infra/infra.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { ProductsModule } from './products/products.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env', join(__dirname, '..', '..', '.env')],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public/browser'),
      renderPath: '/',
      exclude: ['/api*'],
    }),
    DbModule,
    CryptoModule,
    TenantsModule,
    InfraModule,
    DiscoveryModule,
    ProductsModule,
    PlansModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
