"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const db_module_1 = require("./db/db.module");
const crypto_module_1 = require("./crypto/crypto.module");
const tenants_module_1 = require("./tenants/tenants.module");
const infra_module_1 = require("./infra/infra.module");
const discovery_module_1 = require("./discovery/discovery.module");
const products_module_1 = require("./products/products.module");
const plans_module_1 = require("./plans/plans.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '../.env', (0, path_1.join)(__dirname, '..', '..', '.env')],
            }),
            db_module_1.DbModule,
            crypto_module_1.CryptoModule,
            tenants_module_1.TenantsModule,
            infra_module_1.InfraModule,
            discovery_module_1.DiscoveryModule,
            products_module_1.ProductsModule,
            plans_module_1.PlansModule,
            subscriptions_module_1.SubscriptionsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map