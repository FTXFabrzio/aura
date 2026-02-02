import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { InfraService } from './infra.service';
import { AuraKeyGuard } from '../guards/aura-key.guard';

@Controller('api/v1/infra')
export class InfraController {
  constructor(private readonly infraService: InfraService) {}

  @UseGuards(AuraKeyGuard)
  @Post('config')
  async saveConfig(@Body() body: { tenantId: number; productId: number; dbUrl: string; dbToken: string }) {
    await this.infraService.saveConfig(body.tenantId, body.productId, body.dbUrl, body.dbToken);
    return { success: true, message: 'Configuración guardada correctamente' };
  }

  @UseGuards(AuraKeyGuard)
  @Get('configs')
  async getConfigs() {
    return this.infraService.findAll();
  }


  @UseGuards(AuraKeyGuard)
  @Post('test-connection')
  async testConnection(@Body() body: { dbUrl: string; dbToken: string }) {
    return this.infraService.testConnection(body.dbUrl, body.dbToken);
  }

  @UseGuards(AuraKeyGuard)
  @Get('stats')

  async getStats() {
    return this.infraService.getStats();
  }
}
