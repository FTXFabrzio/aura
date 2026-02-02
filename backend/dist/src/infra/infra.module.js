"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfraModule = void 0;
const common_1 = require("@nestjs/common");
const infra_service_1 = require("./infra.service");
const infra_controller_1 = require("./infra.controller");
const crypto_module_1 = require("../crypto/crypto.module");
let InfraModule = class InfraModule {
};
exports.InfraModule = InfraModule;
exports.InfraModule = InfraModule = __decorate([
    (0, common_1.Module)({
        imports: [crypto_module_1.CryptoModule],
        providers: [infra_service_1.InfraService],
        controllers: [infra_controller_1.InfraController],
        exports: [infra_service_1.InfraService],
    })
], InfraModule);
//# sourceMappingURL=infra.module.js.map