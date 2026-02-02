import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { AuraKeyGuard } from '../guards/aura-key.guard';

@Controller('api/v1/tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @UseGuards(AuraKeyGuard)
  @Get()
  async getTenants() {
    return this.tenantsService.findAll();
  }

  @UseGuards(AuraKeyGuard)
  @Get(':id')
  async getTenant(@Param('id', ParseIntPipe) id: number) {
    return this.tenantsService.findOne(id);
  }

  @UseGuards(AuraKeyGuard)
  @Post()
  async createTenant(@Body() body: { name: string; slug: string; domain: string; status?: 'active' | 'suspended' | 'trial' }) {
    return this.tenantsService.create(body);
  }
}
