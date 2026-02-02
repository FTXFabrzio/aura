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
exports.DiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const libsql_1 = require("drizzle-orm/libsql");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const crypto_service_1 = require("../crypto/crypto.service");
let DiscoveryService = class DiscoveryService {
    db;
    cryptoService;
    constructor(db, cryptoService) {
        this.db = db;
        this.cryptoService = cryptoService;
    }
    async resolveDomain(identifier, productSecret) {
        const product = await this.db.query.products.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.products.apiKeySecret, productSecret),
        });
        if (!product) {
            throw new common_1.ForbiddenException('Invalid X-AURA-SECRET');
        }
        const tenant = await this.db.query.tenants.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tenants.domain, identifier),
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Empresa con slug '${identifier}' no encontrada.`);
        }
        const tenantId = tenant.id;
        const subscription = await this.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.tenantId, tenantId), (0, drizzle_orm_1.eq)(schema.subscriptions.status, 'active')),
            with: {
                plan: true,
            },
        });
        if (!subscription) {
            throw new common_1.ForbiddenException(`El cliente '${identifier}' no tiene una suscripción activa en Aura.`);
        }
        if (!subscription.plan) {
            throw new common_1.ForbiddenException(`Error de integridad: La suscripción no tiene un Plan asociado.`);
        }
        if (subscription.plan.productId !== product.id) {
            throw new common_1.ForbiddenException(`El cliente tiene una suscripción activa, pero es para otro producto, no para ${product.name}.`);
        }
        const infra = await this.db.query.infraConfigs.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.infraConfigs.tenantId, tenantId), (0, drizzle_orm_1.eq)(schema.infraConfigs.productId, product.id)),
        });
        if (!infra) {
            throw new common_1.NotFoundException(`Aura no tiene registrada ninguna base de datos para ${product.name} en esta empresa. Ve a 'Config. Infra'.`);
        }
        try {
            const decryptedToken = this.cryptoService.decrypt(infra.dbTokenEncrypted, infra.encryptionIv);
            return {
                tenantId,
                productId: product.id,
                dbUrl: infra.dbUrl,
                dbToken: decryptedToken,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al descifrar el token. Es probable que la AURA_MASTER_KEY haya cambiado desde que se guardó el blindaje.');
        }
    }
};
exports.DiscoveryService = DiscoveryService;
exports.DiscoveryService = DiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DRIZZLE')),
    __metadata("design:paramtypes", [libsql_1.LibSQLDatabase,
        crypto_service_1.CryptoService])
], DiscoveryService);
//# sourceMappingURL=discovery.service.js.map