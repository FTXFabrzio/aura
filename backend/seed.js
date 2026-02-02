const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seed() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const productId = crypto.randomUUID();
  const tenantId = crypto.randomUUID();

  try {
    // 1. Create a product
    await client.execute({
      sql: 'INSERT INTO products (id, name, description, created_at) VALUES (?, ?, ?, ?)',
      args: [productId, 'Aura Core', 'Main security engine', Date.now()]
    });

    // 2. Create a tenant
    await client.execute({
      sql: 'INSERT INTO tenants (id, name, email_domain, product_id, subscription_status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      args: [tenantId, 'Fortex Corp', 'fortex.com', productId, 'active', Date.now()]
    });

    // 3. Create a domain
    await client.execute({
      sql: 'INSERT INTO domains (id, domain_name, tenant_id, created_at) VALUES (?, ?, ?, ?)',
      args: [crypto.randomUUID(), 'fortex.com', tenantId, Date.now()]
    });

    console.log('Seed data created successfully!');
    console.log('Tenant ID:', tenantId);
  } catch (e) {
    console.log('Error seeding data:', e.message);
  }
}

seed();
