import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TenantsService {
  constructor(
    @Inject('DRIZZLE') private db: LibSQLDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.query.tenants.findMany();
  }

  async findOne(id: number) {
    const tenant = await this.db.query.tenants.findFirst({
      where: eq(schema.tenants.id, id),
    });
    if (!tenant) throw new NotFoundException('Empresa no encontrada');
    return tenant;
  }

  async create(data: { name: string; slug: string; domain: string; status?: 'active' | 'suspended' | 'trial' }) {
    const [result] = await this.db.insert(schema.tenants)
      .values({
        name: data.name,
        slug: data.slug,
        domain: data.domain,
        status: data.status || 'trial',
      })
      .returning();
    return result;
  }

  async getProducts() {
    return this.db.query.products.findMany();
  }
}
