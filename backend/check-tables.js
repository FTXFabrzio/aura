const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const tables = ['products', 'tenants', 'domains', 'infra_configs'];
  
  for (const table of tables) {
    try {
      const res = await client.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}';`);
      if (res.rows.length > 0) {
        console.log(`Table '${table}' exists.`);
      } else {
        console.log(`Table '${table}' does NOT exist.`);
      }
    } catch (e) {
      console.log(`Error checking table '${table}':`, e.message);
    }
  }
}

check();
