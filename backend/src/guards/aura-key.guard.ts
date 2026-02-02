import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuraKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const auraKey = request.headers['x-aura-key'];
    const expectedKey = this.configService.get<string>('AURA_INTERNAL_API_KEY');

    if (!auraKey || auraKey !== expectedKey) {
      throw new UnauthorizedException('Invalid or missing X-AURA-KEY header');
    }

    return true;
  }
}
