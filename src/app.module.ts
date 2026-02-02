import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuraModule } from './infrastructure/aura.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuraModule,
  ],
})
export class AppModule {}
