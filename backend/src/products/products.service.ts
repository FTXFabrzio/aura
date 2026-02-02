import { Injectable, Inject } from '@nestjs/common';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('DRIZZLE') private db: LibSQLDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.query.products.findMany();
  }

  async create(data: { name: string; slug: string; apiKeySecret?: string }) {
    const secret = data.apiKeySecret || `sk_aura_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
    const [result] = await this.db.insert(schema.products)
      .values({
        ...data,
        apiKeySecret: secret,
      })
      .returning();
    return result;
  }
}
