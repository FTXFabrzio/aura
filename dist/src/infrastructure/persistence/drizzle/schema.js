"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptions = exports.plans = exports.infraConfigs = exports.tenants = exports.products = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.products = (0, sqlite_core_1.sqliteTable)('products', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    slug: (0, sqlite_core_1.text)('slug').notNull().unique(),
    apiKeySecret: (0, sqlite_core_1.text)('api_key_secret').notNull(),
});
exports.tenants = (0, sqlite_core_1.sqliteTable)('tenants', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    slug: (0, sqlite_core_1.text)('slug').notNull().unique(),
    status: (0, sqlite_core_1.text)('status').notNull().default('active'),
});
exports.infraConfigs = (0, sqlite_core_1.sqliteTable)('infra_configs', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    tenantId: (0, sqlite_core_1.integer)('tenant_id')
        .notNull()
        .references(() => exports.tenants.id),
    productId: (0, sqlite_core_1.integer)('product_id')
        .notNull()
        .references(() => exports.products.id),
    dbUrl: (0, sqlite_core_1.text)('db_url').notNull(),
    dbTokenEncrypted: (0, sqlite_core_1.text)('db_token_encrypted').notNull(),
    encryptionIv: (0, sqlite_core_1.text)('encryption_iv').notNull(),
});
exports.plans = (0, sqlite_core_1.sqliteTable)('plans', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)('name').notNull(),
    productId: (0, sqlite_core_1.integer)('product_id')
        .notNull()
        .references(() => exports.products.id),
});
exports.subscriptions = (0, sqlite_core_1.sqliteTable)('subscriptions', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    tenantId: (0, sqlite_core_1.integer)('tenant_id')
        .notNull()
        .references(() => exports.tenants.id),
    productId: (0, sqlite_core_1.integer)('product_id')
        .notNull()
        .references(() => exports.products.id),
    planId: (0, sqlite_core_1.integer)('plan_id')
        .notNull()
        .references(() => exports.plans.id),
    status: (0, sqlite_core_1.text)('status').notNull().default('active'),
});
//# sourceMappingURL=schema.js.map