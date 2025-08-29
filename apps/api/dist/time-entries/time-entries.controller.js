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
exports.TimeEntriesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const time_entries_service_1 = require("./time-entries.service");
let TimeEntriesController = class TimeEntriesController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(req, caseId, from, to, userId, billable) {
        return this.service.listByCase(req.user.org, caseId, { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined, userId, billable: billable === 'true' ? true : billable === 'false' ? false : undefined });
    }
    summary(req, caseId, from, to) {
        return this.service.summary(req.user.org, caseId, { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined });
    }
    create(req, body) {
        return this.service.create(req.user.org, { ...body, date: new Date(body.date) });
    }
    update(req, id, body) {
        return this.service.update(req.user.org, id, { ...body, date: body.date ? new Date(body.date) : undefined });
    }
    remove(req, id) {
        return this.service.remove(req.user.org, id);
    }
};
exports.TimeEntriesController = TimeEntriesController;
__decorate([
    (0, common_1.Get)('case/:caseId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('caseId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __param(4, (0, common_1.Query)('userId')),
    __param(5, (0, common_1.Query)('billable')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], TimeEntriesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('case/:caseId/summary'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('caseId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], TimeEntriesController.prototype, "summary", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TimeEntriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], TimeEntriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TimeEntriesController.prototype, "remove", null);
exports.TimeEntriesController = TimeEntriesController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('time-entries'),
    __metadata("design:paramtypes", [time_entries_service_1.TimeEntriesService])
], TimeEntriesController);
//# sourceMappingURL=time-entries.controller.js.map