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
exports.TaskAttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const task_attachments_service_1 = require("./task-attachments.service");
let TaskAttachmentsController = class TaskAttachmentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(req, taskId) {
        return this.service.list(req.user.org, taskId);
    }
    upload(req, body) {
        return this.service.upload({ orgId: req.user.org, taskId: body.taskId, name: body.name, fileBase64: body.fileBase64, mime: body.mime, userId: req.user.sub });
    }
    remove(req, id) {
        return this.service.remove(req.user.org, id);
    }
    signed(req, id) {
        return this.service.signedUrl(req.user.org, id);
    }
};
exports.TaskAttachmentsController = TaskAttachmentsController;
__decorate([
    (0, common_1.Get)('task/:taskId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TaskAttachmentsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('upload'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TaskAttachmentsController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TaskAttachmentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/signed-url'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TaskAttachmentsController.prototype, "signed", null);
exports.TaskAttachmentsController = TaskAttachmentsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('task-attachments'),
    __metadata("design:paramtypes", [task_attachments_service_1.TaskAttachmentsService])
], TaskAttachmentsController);
//# sourceMappingURL=task-attachments.controller.js.map