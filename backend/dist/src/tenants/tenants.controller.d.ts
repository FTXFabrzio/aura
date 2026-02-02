import { TenantsService } from './tenants.service';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    getTenants(): Promise<{
        id: number;
        name: string;
        slug: string;
        createdAt: Date | null;
        domain: string;
        status: "active" | "suspended" | "trial" | null;
    }[]>;
    getTenant(id: number): Promise<{
        id: number;
        name: string;
        slug: string;
        createdAt: Date | null;
        domain: string;
        status: "active" | "suspended" | "trial" | null;
    }>;
    createTenant(body: {
        name: string;
        slug: string;
        domain: string;
        status?: 'active' | 'suspended' | 'trial';
    }): Promise<{
        id: number;
        name: string;
        slug: string;
        createdAt: Date | null;
        domain: string;
        status: "active" | "suspended" | "trial" | null;
    }>;
}
