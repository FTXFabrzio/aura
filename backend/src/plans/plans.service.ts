import { Injectable, Inject } from '@nestjs/common';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PlansService {
  constructor(
    @Inject('DRIZZLE') private db: LibSQLDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.query.plans.findMany({
      with: {
        product: true,
      },
    });
  }

  async findByProduct(productId: number) {
    return this.db.query.plans.findMany({
      where: eq(schema.plans.productId, productId),
    });
  }

  async create(data: { productId: number; name: string; priceCents: number; currency?: string }) {
    const [result] = await this.db.insert(schema.plans)
      .values(data)
      .returning();
    return result;
  }
}
