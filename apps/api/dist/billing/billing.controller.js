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
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const wompi_service_1 = require("./wompi.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let BillingController = class BillingController {
    wompi;
    constructor(wompi) {
        this.wompi = wompi;
    }
    async acceptanceToken() {
        const token = await this.wompi.getAcceptanceToken();
        return { acceptanceToken: token };
    }
    async createPaymentSource(req, body) {
        const organizationId = req.user.org;
        const customerEmail = body.customerEmail || req.user.email;
        const pm = await this.wompi.createPaymentSource({ organizationId, customerEmail, token: body.token, acceptanceToken: body.acceptanceToken, nickname: body.nickname });
        return pm;
    }
    async startTrial(req, body) {
        const organizationId = req.user.org;
        const sub = await this.wompi.startTrialSubscription(organizationId, body.planCode, body.defaultPaymentMethodId);
        return sub;
    }
    async chargeNow(req, body) {
        const organizationId = req.user.org;
        const amountCents = body.amountCents ?? 500 * 100;
        return this.wompi.chargeMonthlySubscription(organizationId, amountCents, body.currency || 'COP');
    }
    async runDue() {
        return this.wompi.runDueCharges();
    }
    async me(req) {
        const organizationId = req.user.org;
        const [subscription, paymentMethods] = await Promise.all([
            this.wompi.getOrganizationSubscription(organizationId),
            this.wompi.listPaymentMethods(organizationId),
        ]);
        const now = new Date();
        const trialActive = subscription?.status === 'TRIALING' && subscription.trialEndsAt && new Date(subscription.trialEndsAt) > now;
        const hasMethod = (paymentMethods || []).length > 0;
        const shouldRedirectToBilling = (!trialActive) && !hasMethod;
        return { subscription, paymentMethods, trialActive, hasMethod, shouldRedirectToBilling };
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Get)('acceptance-token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "acceptanceToken", null);
__decorate([
    (0, common_1.Post)('payment-source'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createPaymentSource", null);
__decorate([
    (0, common_1.Post)('start-trial'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "startTrial", null);
__decorate([
    (0, common_1.Post)('charge-now'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "chargeNow", null);
__decorate([
    (0, common_1.Post)('run-due-charges'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "runDue", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "me", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [wompi_service_1.WompiService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map