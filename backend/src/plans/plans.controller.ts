import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { PlansService } from './plans.service';
import { AuraKeyGuard } from '../guards/aura-key.guard';

@Controller('api/v1/plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @UseGuards(AuraKeyGuard)
  @Get()
  async getPlans() {
    return this.plansService.findAll();
  }

  @UseGuards(AuraKeyGuard)
  @Get('product/:id')
  async getPlansByProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.plansService.findByProduct(productId);
  }

  @UseGuards(AuraKeyGuard)
  @Post()
  async createPlan(@Body() body: { productId: number; name: string; priceCents: number; currency?: string }) {
    return this.plansService.create(body);
  }
}
