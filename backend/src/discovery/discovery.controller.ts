import { Controller, Get, Param, Headers, ForbiddenException } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';

@Controller('api/v1/resolve')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get(':identifier')

  async resolve(
    @Param('identifier') identifier: string,
    @Headers('X-AURA-SECRET') secret: string,
  ) {
    if (!secret) return { error: 'Missing X-AURA-SECRET header' };
    return this.discoveryService.resolveDomain(identifier, secret);
  }
}
