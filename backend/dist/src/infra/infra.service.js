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
exports.InfraService = void 0;
const common_1 = require("@nestjs/common");
const libsql_1 = require("drizzle-orm/libsql");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const crypto_service_1 = require("../crypto/crypto.service");
let InfraService = class InfraService {
    db;
    cryptoService;
    constructor(db, cryptoService) {
        this.db = db;
        this.cryptoService = cryptoService;
    }
    async saveConfig(tenantId, productId, dbUrl, dbToken) {
        const { encryptedData, iv } = this.cryptoService.encrypt(dbToken);
        const existing = await this.db.query.infraConfigs.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.infraConfigs.tenantId, tenantId), (0, drizzle_orm_1.eq)(schema.infraConfigs.productId, productId)),
        });
        if (existing) {
            await this.db.update(schema.infraConfigs)
                .set({
                dbUrl,
                dbTokenEncrypted: encryptedData,
                encryptionIv: iv
            })
                .where((0, drizzle_orm_1.eq)(schema.infraConfigs.id, existing.id))
                .run();
        }
        else {
            await this.db.insert(schema.infraConfigs)
                .values({
                tenantId,
                productId,
                dbUrl,
                dbTokenEncrypted: encryptedData,
                encryptionIv: iv,
            })
                .run();
        }
    }
    async findAll() {
        return this.db.query.infraConfigs.findMany({
            with: {
                tenant: true,
                product: true,
            }
        });
    }
    async testConnection(dbUrl, dbToken) {
        const { createClient } = await import('@libsql/client');
        const client = createClient({ url: dbUrl, authToken: dbToken });
        try {
            await client.execute('SELECT 1');
            return { success: true, message: 'Conexión exitosa' };
        }
        catch (e) {
            return { success: false, message: e.message };
        }
    }
    async getStats() {
        const tenants = await this.db.select().from(schema.tenants).all();
        const configs = await this.db.select().from(schema.infraConfigs).all();
        return {
            tenants: tenants.length,
            infraConfigs: configs.length,
        };
    }
};
exports.InfraService = InfraService;
exports.InfraService = InfraService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DRIZZLE')),
    __metadata("design:paramtypes", [libsql_1.LibSQLDatabase,
        crypto_service_1.CryptoService])
], InfraService);
//# sourceMappingURL=infra.service.js.map