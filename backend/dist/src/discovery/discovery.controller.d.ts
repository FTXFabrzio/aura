import { DiscoveryService } from './discovery.service';
export declare class DiscoveryController {
    private readonly discoveryService;
    constructor(discoveryService: DiscoveryService);
    resolve(identifier: string, secret: string): Promise<{
        tenantId: number;
        productId: number;
        dbUrl: string;
        dbToken: string;
    } | {
        error: string;
    }>;
}
