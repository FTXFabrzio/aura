import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    getPlans(): Promise<{
        id: number;
        name: string;
        productId: number;
        priceCents: number;
        currency: string | null;
        product: {
            id: number;
            name: string;
            slug: string;
            apiKeySecret: string;
            createdAt: Date | null;
        };
    }[]>;
    getPlansByProduct(productId: number): Promise<{
        id: number;
        name: string;
        productId: number;
        priceCents: number;
        currency: string | null;
    }[]>;
    createPlan(body: {
        productId: number;
        name: string;
        priceCents: number;
        currency?: string;
    }): Promise<{
        id: number;
        name: string;
        productId: number;
        priceCents: number;
        currency: string | null;
    }>;
}
