import { Injectable, Inject } from '@nestjs/common';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject('DRIZZLE') private db: LibSQLDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.query.subscriptions.findMany({
      with: {
        tenant: true,
        plan: true,
      },
    });
  }

  async create(data: { tenantId: number; planId: number; status?: 'active' | 'past_due' | 'canceled'; expiresAt?: Date }) {
    // 1. Crear suscripción
    const [result] = await this.db.insert(schema.subscriptions)
      .values({
        ...data,
        status: data.status || 'active',
      })
      .returning();

    // 2. Activar el Tenant automáticamente si se suscribe
    await this.db.update(schema.tenants)
      .set({ status: 'active' })
      .where(eq(schema.tenants.id, data.tenantId))
      .run();

    return result;
  }

  async updateStatus(id: number, status: 'active' | 'past_due' | 'canceled') {
    return this.db.update(schema.subscriptions)
      .set({ status })
      .where(eq(schema.subscriptions.id, id))
      .run();
  }
}
