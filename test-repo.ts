import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './src/infrastructure/persistence/drizzle/schema';
import * as dotenv from 'dotenv';
import { CryptoService } from './src/infrastructure/security/crypto.service';
import { ConfigService } from '@nestjs/config';
import { eq, and } from 'drizzle-orm';

dotenv.config();

async function test() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  });

  const db = drizzle(client, { schema });
  const configService = new ConfigService(process.env);
  const cryptoService = new CryptoService(configService);

  const slug = 'htl-elevadores';
  const productSecret = 'd8cfad6efaad3522f99f3f3be7a6bdde37269c141e7e2bc03c8220a7375b8c735'; // The wrong one

  console.log('Testing with slug:', slug);
  console.log('Testing with productSecret:', productSecret);

  try {
    const product = await db.query.products.findFirst({
      where: eq(schema.products.apiKeySecret, productSecret),
    });

    if (!product) {
       console.log('Product not found (expected behavior for wrong key)');
       return;
    }

    console.log('Product found:', product.name);

    // ... rest of the logic ...
  } catch (error) {
    console.error('Error during execution:', error);
  }

  process.exit(0);
}

test();
