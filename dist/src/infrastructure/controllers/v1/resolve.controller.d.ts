import { ResolveTenantUseCase } from '../../../application/use-cases/resolve-tenant.use-case';
export declare class ResolveController {
    private readonly resolveTenantUseCase;
    constructor(resolveTenantUseCase: ResolveTenantUseCase);
    resolve(slug: string, productSecret: string): Promise<import("../../../domain/ports/tenant.repository.port").TenantResolution>;
}
