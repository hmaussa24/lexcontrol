import { PrismaService } from '../prisma/prisma.service';
import type { SupabaseClient } from '@supabase/supabase-js';
export declare class DocumentsService {
    private readonly prisma;
    private readonly supabase;
    constructor(prisma: PrismaService, supabase: SupabaseClient);
    private ensureBucketExists;
    listByCase(orgId: string, caseId: string, filters?: {
        q?: string;
        access?: string;
        tag?: string;
    }): any;
    uploadNewVersion(params: {
        orgId: string;
        caseId: string;
        name: string;
        folder?: string;
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
            size?: number;
        };
        userId?: string;
    }): Promise<{
        document: any;
        downloadUrl: string;
    }>;
    signedUrlForDocument(orgId: string, documentId: string): Promise<{
        url: string;
    }>;
    updateDocument(orgId: string, id: string, data: Partial<{
        name: string;
        access: string;
        tags: string[];
    }>): Promise<any>;
    listVersions(orgId: string, documentId: string): Promise<any>;
    signedUrlForVersion(orgId: string, versionId: string): Promise<{
        url: string;
    }>;
    uploadNewVersionForDocument(params: {
        orgId: string;
        documentId: string;
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
            size?: number;
        };
        userId?: string;
    }): Promise<any>;
}
