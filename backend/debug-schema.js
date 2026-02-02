const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function debugSchema() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const tables = ['products', 'tenants', 'domains', 'infra_configs'];
  
  for (const table of tables) {
    console.log(`--- Schema for ${table} ---`);
    try {
      const res = await client.execute(`PRAGMA table_info(${table})`);
      console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
      console.log(`Error:`, e.message);
    }
  }
}

debugSchema();
