import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    signup(body: {
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
    login(body: {
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
    me(req: any): {
        userId: any;
        organizationId: any;
    };
}
