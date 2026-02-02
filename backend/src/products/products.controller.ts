import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuraKeyGuard } from '../guards/aura-key.guard';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuraKeyGuard)
  @Get()
  async getProducts() {
    return this.productsService.findAll();
  }

  @UseGuards(AuraKeyGuard)
  @Post()
  async createProduct(@Body() body: { name: string; slug: string; apiKeySecret: string }) {
    return this.productsService.create(body);
  }
}
