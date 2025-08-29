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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubscriptionGuard = class SubscriptionGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const path = req?.path || req?.url || '';
        const method = req?.method || '';
        if (method === 'OPTIONS')
            return true;
        if (path.startsWith('/auth') || path.startsWith('/billing') || path.startsWith('/public'))
            return true;
        const orgId = req?.user?.org;
        if (!orgId)
            return true;
        const now = new Date();
        const sub = await this.prisma.subscription.findUnique({ where: { organizationId: orgId } });
        if (!sub)
            return true;
        if (sub.status === 'TRIALING' && sub.trialEndsAt && sub.trialEndsAt > now)
            return true;
        if (sub.status === 'ACTIVE' && sub.currentPeriodEnd && sub.currentPeriodEnd > now)
            return true;
        return false;
    }
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionGuard);
//# sourceMappingURL=subscription.guard.js.map