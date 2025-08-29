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
exports.PublicSuggestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = __importDefault(require("axios"));
let PublicSuggestionsService = class PublicSuggestionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyCaptcha(token, ip) {
        const secret = process.env.HCAPTCHA_SECRET;
        if (!secret)
            throw new common_1.BadRequestException('HCAPTCHA_SECRET no configurado');
        const params = new URLSearchParams({ secret, response: token });
        if (ip)
            params.set('remoteip', ip);
        const { data } = await axios_1.default.post('https://hcaptcha.com/siteverify', params);
        if (!data?.success) {
            const codes = (data && (data['error-codes'] || data.error_codes)) || [];
            const msg = Array.isArray(codes) && codes.length ? `Captcha inválido: ${codes.join(',')}` : 'Captcha inválido';
            throw new common_1.BadRequestException(msg);
        }
    }
    async create(input) {
        if (!input.name || !input.email || !input.content)
            throw new common_1.BadRequestException('Campos requeridos');
        await this.verifyCaptcha(input.captchaToken, input.ip);
        const s = await this.prisma.suggestion.create({ data: { name: input.name, email: input.email, content: input.content } });
        return s;
    }
    list(params) {
        const where = params?.q ? { OR: [{ content: { contains: params.q, mode: 'insensitive' } }, { name: { contains: params.q, mode: 'insensitive' } }] } : undefined;
        const page = params?.page && params.page > 0 ? params.page : 1;
        const pageSize = params?.pageSize && params.pageSize > 0 ? params.pageSize : 20;
        const orderBy = params?.sort === 'top' ? { votesCount: 'desc' } : { createdAt: 'desc' };
        return this.prisma.$transaction([
            this.prisma.suggestion.count({ where }),
            this.prisma.suggestion.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
        ]).then(([total, data]) => ({ total, page, pageSize, data }));
    }
    async vote(id, input) {
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.suggestionVote.create({ data: { suggestionId: id, email: input.email, ip: input.ip } });
                await tx.suggestion.update({ where: { id }, data: { votesCount: { increment: 1 } } });
            });
        }
        catch (e) {
            throw new common_1.BadRequestException('Ya votaste esta sugerencia');
        }
        return { ok: true };
    }
};
exports.PublicSuggestionsService = PublicSuggestionsService;
exports.PublicSuggestionsService = PublicSuggestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicSuggestionsService);
//# sourceMappingURL=public-suggestions.service.js.map