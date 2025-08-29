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
exports.CaseAssignmentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const case_assignments_service_1 = require("./case-assignments.service");
let CaseAssignmentsController = class CaseAssignmentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(req, caseId) {
        return this.service.listByCase(req.user.org, caseId);
    }
    create(req, body) {
        return this.service.create(req.user.org, {
            ...body,
            since: body.since ? new Date(body.since) : undefined,
            until: body.until ? new Date(body.until) : undefined,
        });
    }
    update(req, id, body) {
        return this.service.update(req.user.org, id, {
            ...body,
            since: body.since ? new Date(body.since) : undefined,
            until: body.until ? new Date(body.until) : undefined,
        });
    }
    remove(req, id) {
        return this.service.remove(req.user.org, id);
    }
};
exports.CaseAssignmentsController = CaseAssignmentsController;
__decorate([
    (0, common_1.Get)('case/:caseId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('caseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CaseAssignmentsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CaseAssignmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CaseAssignmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CaseAssignmentsController.prototype, "remove", null);
exports.CaseAssignmentsController = CaseAssignmentsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('case-assignments'),
    __metadata("design:paramtypes", [case_assignments_service_1.CaseAssignmentsService])
], CaseAssignmentsController);
//# sourceMappingURL=case-assignments.controller.js.map