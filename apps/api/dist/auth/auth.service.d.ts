import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { WompiService } from '../billing/wompi.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly wompi;
    constructor(prisma: PrismaService, jwt: JwtService, wompi: WompiService);
    signup(input: {
        organizationName: string;
        name: string;
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        organization: {
            id: string;
            name: string;
        };
    }>;
    login(input: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    private sign;
}
