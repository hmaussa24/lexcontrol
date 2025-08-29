import { PrismaService } from '../prisma/prisma.service';
import type { SupabaseClient } from '@supabase/supabase-js';
export declare class TaskAttachmentsService {
    private readonly prisma;
    private readonly supabase;
    constructor(prisma: PrismaService, supabase: SupabaseClient);
    list(orgId: string, taskId: string): Promise<any>;
    upload(params: {
        orgId: string;
        taskId: string;
        name: string;
        fileBase64: string;
        mime?: string;
        userId?: string;
    }): Promise<any>;
    remove(orgId: string, id: string): Promise<{
        ok: boolean;
    }>;
    signedUrl(orgId: string, id: string): Promise<{
        url: string;
    }>;
}
