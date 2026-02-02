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
exports.ResolveController = void 0;
const common_1 = require("@nestjs/common");
const resolve_tenant_use_case_1 = require("../../../application/use-cases/resolve-tenant.use-case");
let ResolveController = class ResolveController {
    resolveTenantUseCase;
    constructor(resolveTenantUseCase) {
        this.resolveTenantUseCase = resolveTenantUseCase;
    }
    async resolve(slug, productSecret) {
        if (!productSecret) {
            throw new common_1.UnauthorizedException('X-AURA-SECRET header is required');
        }
        return await this.resolveTenantUseCase.execute(slug, productSecret);
    }
};
exports.ResolveController = ResolveController;
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Headers)('X-AURA-SECRET')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ResolveController.prototype, "resolve", null);
exports.ResolveController = ResolveController = __decorate([
    (0, common_1.Controller)('v1/resolve'),
    __metadata("design:paramtypes", [resolve_tenant_use_case_1.ResolveTenantUseCase])
], ResolveController);
//# sourceMappingURL=resolve.controller.js.map