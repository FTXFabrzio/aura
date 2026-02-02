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
exports.DiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const discovery_service_1 = require("./discovery.service");
let DiscoveryController = class DiscoveryController {
    discoveryService;
    constructor(discoveryService) {
        this.discoveryService = discoveryService;
    }
    async resolve(identifier, secret) {
        if (!secret)
            return { error: 'Missing X-AURA-SECRET header' };
        return this.discoveryService.resolveDomain(identifier, secret);
    }
};
exports.DiscoveryController = DiscoveryController;
__decorate([
    (0, common_1.Get)(':identifier'),
    __param(0, (0, common_1.Param)('identifier')),
    __param(1, (0, common_1.Headers)('X-AURA-SECRET')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "resolve", null);
exports.DiscoveryController = DiscoveryController = __decorate([
    (0, common_1.Controller)('api/v1/resolve'),
    __metadata("design:paramtypes", [discovery_service_1.DiscoveryService])
], DiscoveryController);
//# sourceMappingURL=discovery.controller.js.map