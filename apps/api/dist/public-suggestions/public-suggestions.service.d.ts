import { PrismaService } from '../prisma/prisma.service';
export declare class PublicSuggestionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    verifyCaptcha(token: string, ip?: string): Promise<void>;
    create(input: {
        name: string;
        email: string;
        content: string;
        captchaToken: string;
        ip?: string;
    }): Promise<{
        name: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        content: string;
        votesCount: number;
    }>;
    list(params?: {
        q?: string;
        sort?: 'new' | 'top';
        page?: number;
        pageSize?: number;
    }): Promise<{
        total: number;
        page: number;
        pageSize: number;
        data: {
            name: string;
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            content: string;
            votesCount: number;
        }[];
    }>;
    vote(id: string, input: {
        email?: string;
        ip?: string;
    }): Promise<{
        ok: boolean;
    }>;
}
