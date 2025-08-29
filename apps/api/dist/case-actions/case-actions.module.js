"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseActionsModule = void 0;
const common_1 = require("@nestjs/common");
const case_actions_service_1 = require("./case-actions.service");
const case_actions_controller_1 = require("./case-actions.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let CaseActionsModule = class CaseActionsModule {
};
exports.CaseActionsModule = CaseActionsModule;
exports.CaseActionsModule = CaseActionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [case_actions_controller_1.CaseActionsController],
        providers: [case_actions_service_1.CaseActionsService],
    })
], CaseActionsModule);
//# sourceMappingURL=case-actions.module.js.map