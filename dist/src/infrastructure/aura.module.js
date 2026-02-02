"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuraModule = void 0;
const common_1 = require("@nestjs/common");
const persistence_module_1 = require("./persistence/persistence.module");
const crypto_service_1 = require("./security/crypto.service");
const resolve_controller_1 = require("./controllers/v1/resolve.controller");
const resolve_tenant_use_case_1 = require("../application/use-cases/resolve-tenant.use-case");
const tenant_repository_port_1 = require("../domain/ports/tenant.repository.port");
const tenant_drizzle_repository_1 = require("./adapters/persistence/tenant.drizzle.repository");
let AuraModule = class AuraModule {
};
exports.AuraModule = AuraModule;
exports.AuraModule = AuraModule = __decorate([
    (0, common_1.Module)({
        imports: [persistence_module_1.PersistenceModule],
        controllers: [resolve_controller_1.ResolveController],
        providers: [
            crypto_service_1.CryptoService,
            resolve_tenant_use_case_1.ResolveTenantUseCase,
            {
                provide: tenant_repository_port_1.TenantRepository,
                useClass: tenant_drizzle_repository_1.TenantDrizzleRepository,
            },
        ],
        exports: [crypto_service_1.CryptoService],
    })
], AuraModule);
//# sourceMappingURL=aura.module.js.map