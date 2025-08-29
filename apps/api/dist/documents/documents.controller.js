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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_guard_1 = require("../auth/jwt.guard");
const documents_service_1 = require("./documents.service");
let DocumentsController = class DocumentsController {
    docs;
    constructor(docs) {
        this.docs = docs;
    }
    listByCase(req, caseId, q, access, tag) {
        return this.docs.listByCase(req.user.org, caseId, { q: q || undefined, access: access || undefined, tag: tag || undefined });
    }
    async upload(req, body) {
        const buffer = Buffer.from(body.fileBase64, 'base64');
        return this.docs.uploadNewVersion({
            orgId: req.user.org,
            caseId: body.caseId,
            name: body.name,
            folder: body.folder,
            file: { buffer, mimetype: body.mime, originalname: body.name, size: buffer.length },
            userId: req.user.sub,
        });
    }
    async uploadMultipart(req, body, file) {
        if (!file)
            throw new Error('Archivo requerido');
        return this.docs.uploadNewVersion({
            orgId: req.user.org,
            caseId: body.caseId,
            name: body.name || file.originalname,
            folder: body.folder,
            file: { buffer: file.buffer, mimetype: file.mimetype, originalname: file.originalname, size: file.size },
            userId: req.user.sub,
        });
    }
    signed(req, id) {
        return this.docs.signedUrlForDocument(req.user.org, id);
    }
    update(req, id, body) {
        return this.docs.updateDocument(req.user.org, id, body);
    }
    versions(req, id) {
        return this.docs.listVersions(req.user.org, id);
    }
    versionSigned(req, versionId) {
        return this.docs.signedUrlForVersion(req.user.org, versionId);
    }
    uploadVersion(req, id, file) {
        if (!file)
            throw new Error('Archivo requerido');
        return this.docs.uploadNewVersionForDocument({ orgId: req.user.org, documentId: id, file: { buffer: file.buffer, mimetype: file.mimetype, originalname: file.originalname, size: file.size }, userId: req.user.sub });
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Get)('case/:caseId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('caseId')),
    __param(2, (0, common_1.Query)('q')),
    __param(3, (0, common_1.Query)('access')),
    __param(4, (0, common_1.Query)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "listByCase", null);
__decorate([
    (0, common_1.Post)('upload'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "upload", null);
__decorate([
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Post)('upload-multipart'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "uploadMultipart", null);
__decorate([
    (0, common_1.Get)(':id/signed-url'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "signed", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/versions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "versions", null);
__decorate([
    (0, common_1.Get)('versions/:versionId/signed-url'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "versionSigned", null);
__decorate([
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Post)(':id/upload-version'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "uploadVersion", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map