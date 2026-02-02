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

  async create(data: { name: string; slug: string; apiKeySecret: string }) {
    const [result] = await this.db.insert(schema.products)
      .values(data)
      .returning();
    return result;
  }
}
