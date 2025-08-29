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
exports.PublicSuggestionsController = void 0;
const common_1 = require("@nestjs/common");
const public_suggestions_service_1 = require("./public-suggestions.service");
let PublicSuggestionsController = class PublicSuggestionsController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(q, sort, page, pageSize) {
        return this.service.list({ q, sort, page: page ? parseInt(page) : undefined, pageSize: pageSize ? parseInt(pageSize) : undefined });
    }
    create(body, ip) {
        return this.service.create({ ...body, ip });
    }
    vote(id, body, ip) {
        return this.service.vote(id, { email: body?.email, ip });
    }
};
exports.PublicSuggestionsController = PublicSuggestionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('sort')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PublicSuggestionsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PublicSuggestionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/vote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], PublicSuggestionsController.prototype, "vote", null);
exports.PublicSuggestionsController = PublicSuggestionsController = __decorate([
    (0, common_1.Controller)('public/suggestions'),
    __metadata("design:paramtypes", [public_suggestions_service_1.PublicSuggestionsService])
], PublicSuggestionsController);
//# sourceMappingURL=public-suggestions.controller.js.map