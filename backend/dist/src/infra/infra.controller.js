"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfraController = void 0;
const common_1 = require("@nestjs/common");
const infra_service_1 = require("./infra.service");
const aura_key_guard_1 = require("../guards/aura-key.guard");
let InfraController = class InfraController {
    infraService;
    constructor(infraService) {
        this.infraService = infraService;
    }
    async saveConfig(body) {
        await this.infraService.saveConfig(body.tenantId, body.productId, body.dbUrl, body.dbToken);
        return { success: true, message: 'Configuración guardada correctamente' };
    }
    async getConfigs() {
        return this.infraService.findAll();
    }
    async testConnection(body) {
        return this.infraService.testConnection(body.dbUrl, body.dbToken);
    }
    async getStats() {
        return this.infraService.getStats();
    }
};
exports.InfraController = InfraController;
__decorate([
    (0, common_1.UseGuards)(aura_key_guard_1.AuraKeyGuard),
    (0, common_1.Post)('config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InfraController.prototype, "saveConfig", null);
__decorate([
    (0, common_1.UseGuards)(aura_key_guard_1.AuraKeyGuard),
    (0, common_1.Get)('configs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InfraController.prototype, "getConfigs", null);
__decorate([
    (0, common_1.UseGuards)(aura_key_guard_1.AuraKeyGuard),
    (0, common_1.Post)('test-connection'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InfraController.prototype, "testConnection", null);
__decorate([
    (0, common_1.UseGuards)(aura_key_guard_1.AuraKeyGuard),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InfraController.prototype, "getStats", null);
exports.InfraController = InfraController = __decorate([
    (0, common_1.Controller)('api/v1/infra'),
    __metadata("design:paramtypes", [infra_service_1.InfraService])
], InfraController);
//# sourceMappingURL=infra.controller.js.map