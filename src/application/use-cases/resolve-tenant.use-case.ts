import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantRepository, TenantResolution } from '../../domain/ports/tenant.repository.port';

@Injectable()
export class ResolveTenantUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(slug: string, productSecret: string): Promise<TenantResolution> {
    const result = await this.tenantRepository.resolveBySlug(slug, productSecret);

    if (!result) {
      throw new NotFoundException(`Tenant with slug ${slug} not found or inactive for this product.`);
    }

    return result;
  }
}
