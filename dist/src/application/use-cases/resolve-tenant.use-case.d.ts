import { TenantRepository, TenantResolution } from '../../domain/ports/tenant.repository.port';
export declare class ResolveTenantUseCase {
    private readonly tenantRepository;
    constructor(tenantRepository: TenantRepository);
    execute(slug: string, productSecret: string): Promise<TenantResolution>;
}
