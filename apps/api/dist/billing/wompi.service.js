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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WompiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../prisma/prisma.service");
let WompiService = class WompiService {
    prisma;
    http;
    publicKey;
    privateKey;
    constructor(prisma) {
        this.prisma = prisma;
        const baseUrl = process.env.WOMPI_BASE_URL ?? 'https://sandbox.wompi.co/v1';
        this.publicKey = process.env.WOMPI_PUBLIC_KEY ?? '';
        this.privateKey = process.env.WOMPI_PRIVATE_KEY ?? '';
        this.http = axios_1.default.create({ baseURL: baseUrl, timeout: 10000 });
    }
    async getAcceptanceToken() {
        if (!this.publicKey) {
            throw new common_1.BadRequestException('Configura WOMPI_PUBLIC_KEY en el backend');
        }
        try {
            const { data } = await this.http.get(`/merchants/${this.publicKey}`);
            const token = data?.data?.presigned_acceptance?.acceptance_token;
            if (!token)
                throw new common_1.BadRequestException('No se pudo obtener acceptance_token de Wompi');
            return token;
        }
        catch (e) {
            const msg = e?.response?.data?.error || e?.message || 'Error consultando Wompi';
            throw new common_1.BadRequestException(msg);
        }
    }
    async createPaymentSource(input) {
        const { customerEmail, token, acceptanceToken, nickname, organizationId } = input;
        if (!this.privateKey) {
            throw new common_1.BadRequestException('Configura WOMPI_PRIVATE_KEY en el backend');
        }
        if (!token)
            throw new common_1.BadRequestException('Falta token de tarjeta');
        if (!acceptanceToken)
            throw new common_1.BadRequestException('Falta acceptance_token');
        let data;
        try {
            const resp = await this.http.post('/payment_sources', {
                type: 'CARD',
                token,
                customer_email: customerEmail,
                acceptance_token: acceptanceToken,
                nickname,
            }, { headers: { Authorization: `Bearer ${this.privateKey}` } });
            data = resp.data;
        }
        catch (e) {
            const msg = e?.response?.data?.error || e?.message || 'Error creando payment source en Wompi';
            throw new common_1.BadRequestException(msg);
        }
        const sourceId = data?.data?.id;
        const cardToken = data?.data?.token || input.token;
        const paymentMethod = await this.prisma.paymentMethod.create({
            data: {
                organizationId,
                provider: 'wompi',
                type: 'CARD',
                wompiPaymentSourceId: sourceId,
                wompiCardToken: cardToken,
                status: 'ACTIVE',
            },
        });
        return paymentMethod;
    }
    async chargeMonthlySubscription(organizationId, amountCents, currency) {
        const org = await this.prisma.organization.findUnique({ where: { id: organizationId }, include: { subscription: true, defaultPaymentMethod: true } });
        if (!org || !org.subscription)
            throw new common_1.BadRequestException('Organización o suscripción no encontrada');
        if (!org.defaultPaymentMethod?.wompiPaymentSourceId)
            throw new common_1.BadRequestException('No hay método de pago por defecto');
        if (!this.privateKey)
            throw new common_1.BadRequestException('Configura WOMPI_PRIVATE_KEY');
        const cents = amountCents ?? parseInt(process.env.BILLING_AMOUNT_CENTS || '20000');
        const curr = currency || process.env.BILLING_CURRENCY || 'COP';
        try {
            const { data } = await this.http.post('/transactions', {
                amount_in_cents: cents,
                currency: curr,
                customer_email: (await this.prisma.user.findFirst({ where: { organizationId }, orderBy: { createdAt: 'asc' } }))?.email,
                payment_method: { type: 'CARD', installments: 1 },
                payment_source_id: org.defaultPaymentMethod.wompiPaymentSourceId,
            }, { headers: { Authorization: `Bearer ${this.privateKey}` } });
            const status = data?.data?.status || 'PENDING';
            const now = new Date();
            const nextEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            await this.prisma.subscription.update({ where: { organizationId }, data: {
                    lastChargeAt: now,
                    lastChargeStatus: status,
                    lastChargeError: null,
                    status: (status === 'APPROVED' ? 'ACTIVE' : status === 'DECLINED' ? 'PAST_DUE' : org.subscription.status),
                    currentPeriodStart: status === 'APPROVED' ? now : org.subscription.currentPeriodStart,
                    currentPeriodEnd: status === 'APPROVED' ? nextEnd : org.subscription.currentPeriodEnd,
                } });
            return { status };
        }
        catch (e) {
            const msg = e?.response?.data?.error || e?.message || 'Error al cobrar suscripción';
            await this.prisma.subscription.update({ where: { organizationId }, data: {
                    lastChargeAt: new Date(),
                    lastChargeStatus: 'ERROR',
                    lastChargeError: msg,
                    status: 'PAST_DUE',
                } });
            throw new common_1.BadRequestException(msg);
        }
    }
    async runDueCharges() {
        const now = new Date();
        const subs = await this.prisma.subscription.findMany({
            where: {
                OR: [
                    { status: 'TRIALING', trialEndsAt: { lte: now } },
                    { status: { in: ['ACTIVE', 'PAST_DUE'] }, currentPeriodEnd: { lte: now } },
                ],
            },
            include: { organization: { include: { defaultPaymentMethod: true } } },
        });
        const results = [];
        for (const s of subs) {
            try {
                const r = await this.chargeMonthlySubscription(s.organizationId);
                results.push({ organizationId: s.organizationId, ok: true, status: r.status });
            }
            catch (e) {
                results.push({ organizationId: s.organizationId, ok: false, error: e?.message });
            }
        }
        return { count: subs.length, results };
    }
    async startTrialSubscription(organizationId, planCode = 'PRO', defaultPaymentMethodId) {
        const now = new Date();
        const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const subscription = await this.prisma.subscription.upsert({
            where: { organizationId },
            update: {
                planCode,
                status: 'TRIALING',
                trialEndsAt,
                currentPeriodStart: now,
                currentPeriodEnd: trialEndsAt,
                defaultPaymentMethodId,
            },
            create: {
                organizationId,
                planCode,
                status: 'TRIALING',
                trialEndsAt,
                currentPeriodStart: now,
                currentPeriodEnd: trialEndsAt,
                defaultPaymentMethodId,
            },
        });
        if (defaultPaymentMethodId) {
            await this.prisma.organization.update({
                where: { id: organizationId },
                data: { defaultPaymentMethodId },
            });
        }
        return subscription;
    }
    async getOrganizationSubscription(organizationId) {
        return this.prisma.subscription.findUnique({ where: { organizationId } });
    }
    async listPaymentMethods(organizationId) {
        return this.prisma.paymentMethod.findMany({ where: { organizationId, status: 'ACTIVE' } });
    }
    async handleWebhook(payload) {
        try {
            const event = payload?.event;
            const data = payload?.data;
            if (event === 'transaction.updated' || event === 'transaction.created') {
                return;
            }
            if (event === 'subscription.charged') {
                const orgExtId = data?.subscription?.customer_email;
                return;
            }
        }
        catch (e) {
        }
    }
};
exports.WompiService = WompiService;
exports.WompiService = WompiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WompiService);
//# sourceMappingURL=wompi.service.js.map