const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function resetDb() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const dropQueries = [
    'DROP TABLE IF EXISTS tenant_domains;',
    'DROP TABLE IF EXISTS infra_configs;',
    'DROP TABLE IF EXISTS subscriptions;',
    'DROP TABLE IF EXISTS plans;',
    'DROP TABLE IF EXISTS tenants;',
    'DROP TABLE IF EXISTS products;',
    'DROP TABLE IF EXISTS domains;' // Ensure the old one is gone
  ];

  const createQueries = [
    `CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER
    );`,
    `CREATE TABLE tenants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email_domain TEXT NOT NULL UNIQUE,
      product_id INTEGER REFERENCES products(id),
      created_at INTEGER
    );`,
    `CREATE TABLE plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      created_at INTEGER
    );`,
    `CREATE TABLE subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id INTEGER REFERENCES tenants(id),
      plan_id INTEGER REFERENCES plans(id),
      status TEXT NOT NULL,
      expires_at INTEGER,
      created_at INTEGER
    );`,
    `CREATE TABLE tenant_domains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain TEXT NOT NULL UNIQUE,
      tenant_id INTEGER REFERENCES tenants(id),
      product_id INTEGER REFERENCES products(id),
      created_at INTEGER
    );`,
    `CREATE TABLE infra_configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id INTEGER REFERENCES tenants(id) UNIQUE,
      db_url TEXT NOT NULL,
      db_token_encrypted TEXT NOT NULL,
      encryption_iv TEXT NOT NULL,
      created_at INTEGER
    );`
  ];

  // Seed Data
  const seedQueries = [
    `INSERT INTO products (name, description) VALUES ('Aura Cloud', 'Infraestructura SaaS Core');`,
    `INSERT INTO plans (name, code) VALUES ('Plan Pro', 'pro');`,
    `INSERT INTO tenants (name, email_domain, product_id) VALUES ('Fortex Elevadores', 'fortex.com', 1);`,
    `INSERT INTO subscriptions (tenant_id, plan_id, status) VALUES (1, 1, 'active');`,
    `INSERT INTO tenant_domains (domain, tenant_id, productId) VALUES ('fortex.com', 1, 1);`
  ];

  console.log('Limpiando base de datos...');
  for (const q of dropQueries) {
    try {
      await client.execute(q);
    } catch (e) {}
  }

  console.log('Creando nuevas tablas (Esquema Modular Aura)...');
  for (const q of createQueries) {
    await client.execute(q);
  }

  console.log('Ejecutando semilla de prueba...');
  try {
    await client.execute({ sql: 'INSERT INTO products (name, description) VALUES (?, ?)', args: ['Aura Cloud', 'Infraestructura SaaS Core'] });
    await client.execute({ sql: 'INSERT INTO plans (name, code) VALUES (?, ?)', args: ['Plan Pro', 'pro'] });
    await client.execute({ sql: 'INSERT INTO tenants (name, email_domain, product_id) VALUES (?, ?, ?)', args: ['Fortex Elevadores', 'fortex.com', 1] });
    await client.execute({ sql: 'INSERT INTO subscriptions (tenant_id, plan_id, status) VALUES (?, ?, ?)', args: [1, 1, 'active'] });
    await client.execute({ sql: 'INSERT INTO tenant_domains (domain, tenant_id, product_id) VALUES (?, ?, ?)', args: ['fortex.com', 1, 1] });
    console.log('Semilla completada.');
  } catch (e) {
    console.log('Error en semilla:', e.message);
  }
}

resetDb();
