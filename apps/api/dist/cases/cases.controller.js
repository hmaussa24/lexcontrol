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
exports.CasesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const cases_service_1 = require("./cases.service");
let CasesController = class CasesController {
    cases;
    constructor(cases) {
        this.cases = cases;
    }
    list(req, q, status, clientId, processType, page, pageSize, sort, dir) {
        return this.cases.list(req.user.org, {
            q,
            status,
            clientId,
            processType,
            page: page ? parseInt(page) : undefined,
            pageSize: pageSize ? parseInt(pageSize) : undefined,
            sort,
            dir,
        });
    }
    get(req, id) {
        return this.cases.get(req.user.org, id);
    }
    summary(req, id) {
        return this.cases.summary(req.user.org, id);
    }
    create(req, body) {
        return this.cases.create(req.user.org, body);
    }
    update(req, id, body) {
        return this.cases.update(req.user.org, id, body);
    }
    remove(req, id) {
        return this.cases.remove(req.user.org, id);
    }
};
exports.CasesController = CasesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('clientId')),
    __param(4, (0, common_1.Query)('processType')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('pageSize')),
    __param(7, (0, common_1.Query)('sort')),
    __param(8, (0, common_1.Query)('dir')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "summary", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "remove", null);
exports.CasesController = CasesController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cases'),
    __metadata("design:paramtypes", [cases_service_1.CasesService])
], CasesController);
//# sourceMappingURL=cases.controller.js.map