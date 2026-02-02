const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function init() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const queries = [
    `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email_domain TEXT NOT NULL UNIQUE,
      product_id TEXT REFERENCES products(id),
      subscription_status TEXT NOT NULL,
      created_at INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS domains (
      id TEXT PRIMARY KEY,
      domain_name TEXT NOT NULL UNIQUE,
      tenant_id TEXT REFERENCES tenants(id),
      created_at INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS infra_configs (
      id TEXT PRIMARY KEY,
      tenant_id TEXT REFERENCES tenants(id) UNIQUE,
      db_url TEXT NOT NULL,
      db_token_encrypted TEXT NOT NULL,
      created_at INTEGER
    );`
  ];

  for (const q of queries) {
    try {
      await client.execute(q);
      console.log('Executed query successfully.');
    } catch (e) {
      console.log('Error executing query:', e.message);
    }
  }
}

init();
