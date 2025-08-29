import { PublicSuggestionsService } from './public-suggestions.service';
export declare class PublicSuggestionsController {
    private readonly service;
    constructor(service: PublicSuggestionsService);
    list(q?: string, sort?: 'new' | 'top', page?: string, pageSize?: string): Promise<{
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
    create(body: {
        name: string;
        email: string;
        content: string;
        captchaToken: string;
    }, ip: string): Promise<{
        name: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        content: string;
        votesCount: number;
    }>;
    vote(id: string, body: {
        email?: string;
    }, ip: string): Promise<{
        ok: boolean;
    }>;
}
