import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// 1. IDENTIDAD DEL ECOSISTEMA
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(), // 'operate', 'operate'
  apiKeySecret: text('api_key_secret').notNull(), // Clave para que el backend del producto hable con Aura
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const productsRelations = relations(products, ({ many }) => ({
  infraConfigs: many(infraConfigs),
  plans: many(plans),
}));

// 2. IDENTIDAD LEGAL (La Empresa)
export const tenants = sqliteTable('tenants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(), // identificador interno
  domain: text('domain').notNull().unique(), // @identificador (ej: fortex.com)
  status: text('status', { enum: ['active', 'suspended', 'trial'] }).default('trial'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const tenantsRelations = relations(tenants, ({ many }) => ({
  infraConfigs: many(infraConfigs),
  subscriptions: many(subscriptions),
}));

// 4. INFRAESTRUCTURA (Las llaves de Turso)
export const infraConfigs = sqliteTable('infra_configs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  productId: integer('product_id').notNull().references(() => products.id),
  dbUrl: text('db_url').notNull(),
  dbTokenEncrypted: text('db_token_encrypted').notNull(), // Cifrado con AES-256-GCM
  encryptionIv: text('encryption_iv').notNull(), // Vector único para el descifrado
}, (t) => ({
  unq: unique().on(t.tenantId, t.productId), // Un tenant tiene una sola DB por producto
}));

export const infraConfigsRelations = relations(infraConfigs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [infraConfigs.tenantId],
    references: [tenants.id],
  }),
  product: one(products, {
    fields: [infraConfigs.productId],
    references: [products.id],
  }),
}));

// 5. NEGOCIO (Planes y Suscripciones)
export const plans = sqliteTable('plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id),
  name: text('name').notNull(),
  priceCents: integer('price_cents').notNull(), // Siempre en centavos
  currency: text('currency').default('USD'),
});

export const plansRelations = relations(plans, ({ one, many }) => ({
  product: one(products, {
    fields: [plans.productId],
    references: [products.id],
  }),
  subscriptions: many(subscriptions),
}));

export const subscriptions = sqliteTable('subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  planId: integer('plan_id').notNull().references(() => plans.id),
  status: text('status', { enum: ['active', 'past_due', 'canceled'] }).default('active'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  tenant: one(tenants, {
    fields: [subscriptions.tenantId],
    references: [tenants.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
}));


