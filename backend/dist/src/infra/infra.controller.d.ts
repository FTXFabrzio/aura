import { InfraService } from './infra.service';
export declare class InfraController {
    private readonly infraService;
    constructor(infraService: InfraService);
    saveConfig(body: {
        tenantId: number;
        productId: number;
        dbUrl: string;
        dbToken: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getConfigs(): Promise<{
        id: number;
        tenantId: number;
        productId: number;
        dbUrl: string;
        dbTokenEncrypted: string;
        encryptionIv: string;
        tenant: {
            id: number;
            name: string;
            slug: string;
            createdAt: Date | null;
            domain: string;
            status: "active" | "suspended" | "trial" | null;
        };
        product: {
            id: number;
            name: string;
            slug: string;
            apiKeySecret: string;
            createdAt: Date | null;
        };
    }[]>;
    testConnection(body: {
        dbUrl: string;
        dbToken: string;
    }): Promise<{
        success: boolean;
        message: any;
    }>;
    getStats(): Promise<{
        tenants: number;
        infraConfigs: number;
    }>;
}
