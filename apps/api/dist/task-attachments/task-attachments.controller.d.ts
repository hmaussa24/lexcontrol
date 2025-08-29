import { TaskAttachmentsService } from './task-attachments.service';
export declare class TaskAttachmentsController {
    private readonly service;
    constructor(service: TaskAttachmentsService);
    list(req: any, taskId: string): Promise<any>;
    upload(req: any, body: {
        taskId: string;
        name: string;
        fileBase64: string;
        mime?: string;
    }): Promise<any>;
    remove(req: any, id: string): Promise<{
        ok: boolean;
    }>;
    signed(req: any, id: string): Promise<{
        url: string;
    }>;
}
