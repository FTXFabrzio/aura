const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sql = `
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS infra_configs;
DROP TABLE IF EXISTS tenant_domains;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS products;

-- 1. IDENTIDAD DEL ECOSISTEMA
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    api_key_secret TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. IDENTIDAD LEGAL (La Empresa)
CREATE TABLE tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    status TEXT CHECK(status IN ('active', 'suspended', 'trial')) DEFAULT 'trial',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. INFRAESTRUCTURA (Las llaves de Turso)
CREATE TABLE infra_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    db_url TEXT NOT NULL,
    db_token_encrypted TEXT NOT NULL,
    encryption_iv TEXT NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(tenant_id, product_id)
);

-- 5. NEGOCIO (Planes y Suscripciones)
CREATE TABLE plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('active', 'past_due', 'canceled')) DEFAULT 'active',
    expires_at DATETIME,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);
`;

async function init() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  console.log('Initializing database schema...');
  const statements = sql.split(';').filter(s => s.trim().length > 0);
  
  for (const statement of statements) {
    try {
      await client.execute(statement);
      console.log('Executed statement successfully.');
    } catch (e) {
      console.error('Error executing statement:', statement);
      console.error(e.message);
    }
  }
  
  // Seed initial product
  try {
      await client.execute({
          sql: "INSERT INTO products (name, slug, api_key_secret) VALUES (?, ?, ?)",
          args: ["Operate", "operate", "sk_operate_prod_secret_123"]
      });
      console.log('Inserted default product: Operate');
  } catch (e) {
      console.log('Default product might already exist or error:', e.message);
  }

  console.log('Database initialization complete.');
}

init();
