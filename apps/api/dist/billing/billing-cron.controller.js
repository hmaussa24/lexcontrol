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
exports.BillingCronController = void 0;
const common_1 = require("@nestjs/common");
const wompi_service_1 = require("./wompi.service");
let BillingCronController = class BillingCronController {
    wompi;
    constructor(wompi) {
        this.wompi = wompi;
    }
    async run(key) {
        if (!process.env.CRON_SECRET)
            throw new common_1.BadRequestException('CRON_SECRET no configurado');
        if (key !== process.env.CRON_SECRET)
            throw new common_1.BadRequestException('Clave inválida');
        return this.wompi.runDueCharges();
    }
};
exports.BillingCronController = BillingCronController;
__decorate([
    (0, common_1.Post)('run-due-charges'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingCronController.prototype, "run", null);
exports.BillingCronController = BillingCronController = __decorate([
    (0, common_1.Controller)('billing/cron'),
    __metadata("design:paramtypes", [wompi_service_1.WompiService])
], BillingCronController);
//# sourceMappingURL=billing-cron.controller.js.map