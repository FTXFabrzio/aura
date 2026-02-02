import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './src/infrastructure/persistence/drizzle/schema';
import * as dotenv from 'dotenv';
import { CryptoService } from './src/infrastructure/security/crypto.service';
import { ConfigService } from '@nestjs/config';

dotenv.config();

async function testDecryption() {
  const masterKey65 = process.env.AURA_MASTER_KEY!;
  const masterKey64 = masterKey65.substring(0, 64);
  
  process.env.AURA_MASTER_KEY = masterKey64;
  
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  });

  const db = drizzle(client, { schema });
  const configService = new ConfigService(process.env);
  const cryptoService = new CryptoService(configService);

  const infra = await db.query.infraConfigs.findFirst();
  if (!infra) {
    console.log('No infra found');
    return;
  }

  try {
    const dbToken = cryptoService.decrypt(infra.dbTokenEncrypted, infra.encryptionIv);
    console.log('Decryption SUCCESS!');
    console.log('dbToken:', dbToken);
  } catch (err) {
    console.log('Decryption FAILED with 64-char key.');
    console.log(err.message);
  }
}

testDecryption();
