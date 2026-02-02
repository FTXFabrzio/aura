"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsRelations = exports.subscriptions = exports.plansRelations = exports.plans = exports.infraConfigsRelations = exports.infraConfigs = exports.tenantsRelations = exports.tenants = exports.productsRelations = exports.products = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.products = (0, sqlite_core_1.sqliteTable)('products', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    slug: (0, sqlite_core_1.text)('slug').notNull().unique(),
    apiKeySecret: (0, sqlite_core_1.text)('api_key_secret').notNull(),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ many }) => ({
    infraConfigs: many(exports.infraConfigs),
    plans: many(exports.plans),
}));
exports.tenants = (0, sqlite_core_1.sqliteTable)('tenants', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    slug: (0, sqlite_core_1.text)('slug').notNull().unique(),
    domain: (0, sqlite_core_1.text)('domain').notNull().unique(),
    status: (0, sqlite_core_1.text)('status', { enum: ['active', 'suspended', 'trial'] }).default('trial'),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
exports.tenantsRelations = (0, drizzle_orm_1.relations)(exports.tenants, ({ many }) => ({
    infraConfigs: many(exports.infraConfigs),
    subscriptions: many(exports.subscriptions),
}));
exports.infraConfigs = (0, sqlite_core_1.sqliteTable)('infra_configs', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    tenantId: (0, sqlite_core_1.integer)('tenant_id').notNull().references(() => exports.tenants.id),
    productId: (0, sqlite_core_1.integer)('product_id').notNull().references(() => exports.products.id),
    dbUrl: (0, sqlite_core_1.text)('db_url').notNull(),
    dbTokenEncrypted: (0, sqlite_core_1.text)('db_token_encrypted').notNull(),
    encryptionIv: (0, sqlite_core_1.text)('encryption_iv').notNull(),
}, (t) => ({
    unq: (0, sqlite_core_1.unique)().on(t.tenantId, t.productId),
}));
exports.infraConfigsRelations = (0, drizzle_orm_1.relations)(exports.infraConfigs, ({ one }) => ({
    tenant: one(exports.tenants, {
        fields: [exports.infraConfigs.tenantId],
        references: [exports.tenants.id],
    }),
    product: one(exports.products, {
        fields: [exports.infraConfigs.productId],
        references: [exports.products.id],
    }),
}));
exports.plans = (0, sqlite_core_1.sqliteTable)('plans', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    productId: (0, sqlite_core_1.integer)('product_id').notNull().references(() => exports.products.id),
    name: (0, sqlite_core_1.text)('name').notNull(),
    priceCents: (0, sqlite_core_1.integer)('price_cents').notNull(),
    currency: (0, sqlite_core_1.text)('currency').default('USD'),
});
exports.plansRelations = (0, drizzle_orm_1.relations)(exports.plans, ({ one, many }) => ({
    product: one(exports.products, {
        fields: [exports.plans.productId],
        references: [exports.products.id],
    }),
    subscriptions: many(exports.subscriptions),
}));
exports.subscriptions = (0, sqlite_core_1.sqliteTable)('subscriptions', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    tenantId: (0, sqlite_core_1.integer)('tenant_id').notNull().references(() => exports.tenants.id),
    planId: (0, sqlite_core_1.integer)('plan_id').notNull().references(() => exports.plans.id),
    status: (0, sqlite_core_1.text)('status', { enum: ['active', 'past_due', 'canceled'] }).default('active'),
    expiresAt: (0, sqlite_core_1.integer)('expires_at', { mode: 'timestamp' }),
});
exports.subscriptionsRelations = (0, drizzle_orm_1.relations)(exports.subscriptions, ({ one }) => ({
    tenant: one(exports.tenants, {
        fields: [exports.subscriptions.tenantId],
        references: [exports.tenants.id],
    }),
    plan: one(exports.plans, {
        fields: [exports.subscriptions.planId],
        references: [exports.plans.id],
    }),
}));
//# sourceMappingURL=schema.js.map