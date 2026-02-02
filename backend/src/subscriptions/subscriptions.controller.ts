import { Controller, Get, Post, Body, UseGuards, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { AuraKeyGuard } from '../guards/aura-key.guard';

@Controller('api/v1/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(AuraKeyGuard)
  @Get()
  async getSubscriptions() {
    return this.subscriptionsService.findAll();
  }

  @UseGuards(AuraKeyGuard)
  @Post()
  async createSubscription(@Body() body: { tenantId: number; planId: number; status?: any; expiresAt?: any }) {
    if (body.expiresAt) body.expiresAt = new Date(body.expiresAt);
    return this.subscriptionsService.create(body);
  }

  @UseGuards(AuraKeyGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: any) {
    return this.subscriptionsService.updateStatus(id, status);
  }
}
