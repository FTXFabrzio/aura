import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { ConfigService } from '@nestjs/config';
import * as schema from './schema';

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

export const DrizzleProvider = {
  provide: DRIZZLE_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const url = configService.get<string>('DATABASE_URL');
    const authToken = configService.get<string>('DATABASE_AUTH_TOKEN');

    if (!url) {
      throw new Error('DATABASE_URL is not defined');
    }

    const client = createClient({
      url,
      authToken,
    });

    return drizzle(client, { schema });
  },
  inject: [ConfigService],
};
