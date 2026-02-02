import { Controller, Get, Param, Headers, UnauthorizedException } from '@nestjs/common';
import { ResolveTenantUseCase } from '../../../application/use-cases/resolve-tenant.use-case';

@Controller('v1/resolve')
export class ResolveController {
  constructor(private readonly resolveTenantUseCase: ResolveTenantUseCase) {}

  @Get(':slug')
  async resolve(
    @Param('slug') slug: string,
    @Headers('X-AURA-SECRET') productSecret: string,
  ) {
    if (!productSecret) {
      throw new UnauthorizedException('X-AURA-SECRET header is required');
    }

    return await this.resolveTenantUseCase.execute(slug, productSecret);
  }
}
