import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  apiKeySecret: text('api_key_secret').notNull(),
});

export const tenants = sqliteTable('tenants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  status: text('status').notNull().default('active'), // e.g., 'active', 'suspended'
});

export const infraConfigs = sqliteTable('infra_configs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenantId: integer('tenant_id')
    .notNull()
    .references(() => tenants.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  dbUrl: text('db_url').notNull(),
  dbTokenEncrypted: text('db_token_encrypted').notNull(),
  encryptionIv: text('encryption_iv').notNull(),
});

export const plans = sqliteTable('plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenantId: integer('tenant_id')
    .notNull()
    .references(() => tenants.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  planId: integer('plan_id')
    .notNull()
    .references(() => plans.id),
  status: text('status').notNull().default('active'),
});
