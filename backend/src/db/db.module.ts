import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE',
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        const authToken = configService.get<string>('DATABASE_AUTH_TOKEN');
        console.log('Connecting to database:', url ? 'URL FOUND' : 'URL UNDEFINED');
        if (!url) {
          throw new Error('DATABASE_URL is not defined in the environment/config');
        }
        const client = createClient({ url, authToken });
        return drizzle(client, { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DRIZZLE'],
})
export class DbModule {}
