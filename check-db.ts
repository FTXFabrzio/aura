import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './src/infrastructure/persistence/drizzle/schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function check() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  });

  const db = drizzle(client, { schema });

  const products = await db.query.products.findMany();
  console.log('PRODUCTS_COUNT:', products.length);
  products.forEach(p => console.log('PRODUCT:', JSON.stringify(p)));

  const tenants = await db.query.tenants.findMany();
  console.log('TENANTS_COUNT:', tenants.length);
  tenants.forEach(t => console.log('TENANT:', JSON.stringify(t)));

  const infra = await db.query.infraConfigs.findMany();
  console.log('INFRA_COUNT:', infra.length);
  infra.forEach(i => console.log('INFRA:', JSON.stringify(i)));

  process.exit(0);
}

check();
