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
exports.DeadlinesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const deadlines_service_1 = require("./deadlines.service");
let DeadlinesController = class DeadlinesController {
    deadlines;
    constructor(deadlines) {
        this.deadlines = deadlines;
    }
    upcoming(req, days) {
        return this.deadlines.upcoming(req.user.org, days ? parseInt(days) : 30);
    }
    listByCase(req, caseId) {
        return this.deadlines.listByCase(req.user.org, caseId);
    }
    create(req, body) {
        return this.deadlines.create(req.user.org, { ...body, dueAt: new Date(body.dueAt) });
    }
    update(req, id, body) {
        return this.deadlines.update(req.user.org, id, {
            ...body,
            dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
        });
    }
    remove(req, id) {
        return this.deadlines.remove(req.user.org, id);
    }
};
exports.DeadlinesController = DeadlinesController;
__decorate([
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DeadlinesController.prototype, "upcoming", null);
__decorate([
    (0, common_1.Get)('case/:caseId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('caseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DeadlinesController.prototype, "listByCase", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DeadlinesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], DeadlinesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DeadlinesController.prototype, "remove", null);
exports.DeadlinesController = DeadlinesController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('deadlines'),
    __metadata("design:paramtypes", [deadlines_service_1.DeadlinesService])
], DeadlinesController);
//# sourceMappingURL=deadlines.controller.js.map