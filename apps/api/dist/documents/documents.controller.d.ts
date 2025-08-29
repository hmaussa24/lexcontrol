import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly docs;
    constructor(docs: DocumentsService);
    listByCase(req: any, caseId: string, q?: string, access?: string, tag?: string): any;
    upload(req: any, body: {
        caseId: string;
        name: string;
        folder?: string;
        fileBase64: string;
        mime?: string;
    }): Promise<{
        document: any;
        downloadUrl: string;
    }>;
    uploadMultipart(req: any, body: {
        caseId: string;
        name?: string;
        folder?: string;
    }, file: any): Promise<{
        document: any;
        downloadUrl: string;
    }>;
    signed(req: any, id: string): Promise<{
        url: string;
    }>;
    update(req: any, id: string, body: Partial<{
        name: string;
        access: 'private' | 'equipo' | 'cliente';
        tags: string[];
    }>): Promise<any>;
    versions(req: any, id: string): Promise<any>;
    versionSigned(req: any, versionId: string): Promise<{
        url: string;
    }>;
    uploadVersion(req: any, id: string, file: any): Promise<any>;
}
