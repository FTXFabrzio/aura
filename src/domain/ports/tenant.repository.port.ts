export interface InfrastructureConfig {
  dbUrl: string;
  dbToken: string;
}

export interface TenantResolution {
  tenantId: number;
  tenantName: string;
  tenantSlug: string;
  infra: InfrastructureConfig;
}

export abstract class TenantRepository {
  abstract resolveBySlug(slug: string, productSecret: string): Promise<TenantResolution | null>;
}
