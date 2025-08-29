"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const wompi_service_1 = require("../billing/wompi.service");
let AuthService = class AuthService {
    prisma;
    jwt;
    wompi;
    constructor(prisma, jwt, wompi) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.wompi = wompi;
    }
    async signup(input) {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const org = await this.prisma.organization.create({ data: { name: input.organizationName } });
        const user = await this.prisma.user.create({
            data: {
                organizationId: org.id,
                email: input.email.toLowerCase(),
                name: input.name,
                hashedPassword,
                role: 'admin',
            },
        });
        await this.wompi.startTrialSubscription(org.id, 'PRO');
        const token = await this.sign(user.id, org.id);
        return { token, user: { id: user.id, name: user.name, email: user.email }, organization: { id: org.id, name: org.name } };
    }
    async login(input) {
        const user = await this.prisma.user.findFirst({ where: { email: input.email.toLowerCase(), active: true } });
        if (!user || !user.hashedPassword)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const ok = await bcrypt.compare(input.password, user.hashedPassword);
        if (!ok)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const token = await this.sign(user.id, user.organizationId);
        return { token, user: { id: user.id, name: user.name, email: user.email } };
    }
    async sign(userId, organizationId) {
        return this.jwt.signAsync({ sub: userId, org: organizationId });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService, wompi_service_1.WompiService])
], AuthService);
//# sourceMappingURL=auth.service.js.map