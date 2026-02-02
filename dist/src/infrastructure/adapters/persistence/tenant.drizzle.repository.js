"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantDrizzleRepository = void 0;
const common_1 = require("@nestjs/common");
const drizzle_provider_1 = require("../../persistence/drizzle/drizzle.provider");
const libsql_1 = require("drizzle-orm/libsql");
const schema = __importStar(require("../../persistence/drizzle/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const crypto_service_1 = require("../../security/crypto.service");
let TenantDrizzleRepository = class TenantDrizzleRepository {
    db;
    cryptoService;
    constructor(db, cryptoService) {
        this.db = db;
        this.cryptoService = cryptoService;
    }
    async resolveBySlug(slug, productSecret) {
        const product = await this.db.query.products.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.products.apiKeySecret, productSecret),
        });
        if (!product)
            return null;
        const tenant = await this.db.query.tenants.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tenants.slug, slug),
        });
        if (!tenant || tenant.status !== 'active')
            return null;
        const subscription = await this.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.tenantId, tenant.id), (0, drizzle_orm_1.eq)(schema.subscriptions.productId, product.id), (0, drizzle_orm_1.eq)(schema.subscriptions.status, 'active')),
        });
        if (!subscription)
            return null;
        const infra = await this.db.query.infraConfigs.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.infraConfigs.tenantId, tenant.id), (0, drizzle_orm_1.eq)(schema.infraConfigs.productId, product.id)),
        });
        if (!infra)
            return null;
        const dbToken = this.cryptoService.decrypt(infra.dbTokenEncrypted, infra.encryptionIv);
        return {
            tenantId: tenant.id,
            tenantName: tenant.name,
            tenantSlug: tenant.slug,
            infra: {
                dbUrl: infra.dbUrl,
                dbToken: dbToken,
            },
        };
    }
};
exports.TenantDrizzleRepository = TenantDrizzleRepository;
exports.TenantDrizzleRepository = TenantDrizzleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DRIZZLE_PROVIDER)),
    __metadata("design:paramtypes", [libsql_1.LibSQLDatabase,
        crypto_service_1.CryptoService])
], TenantDrizzleRepository);
//# sourceMappingURL=tenant.drizzle.repository.js.map