import { town } from '@/drizzle/schema';
import { TownInsert, TownSelect, TownUpdate } from '@/drizzle/schema/zod';
import { Database } from '@/infrastructure/database';
import { eq, sql } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class TownRepository {
  constructor(private readonly db: Database) {}

  findAll(): Promise<TownSelect[]> {
    return this.db.context.select().from(town);
  }

  async findById(id: string): Promise<TownSelect | null> {
    const rows = await this.db.context.select().from(town).where(eq(town.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async create(data: TownInsert): Promise<TownSelect> {
    const rows = await this.db.context.insert(town).values(data).returning();
    return rows[0];
  }

  createRange(data: TownInsert[]): Promise<TownSelect[]> {
    return this.db.context.insert(town).values(data).returning();
  }

  upsertRange(data: TownInsert[]): Promise<TownSelect[]> {
    return this.db.context
      .insert(town)
      .values(data)
      .onConflictDoUpdate({
        target: [town.name, town.regionId],
        set: {
          longitude: sql`excluded."longitude"`,
          latitude: sql`excluded."latitude"`,
          mapMarkerType: sql`excluded."mapMarkerType"`,
        },
      })
      .returning();
  }

  async update(id: string, data: TownUpdate): Promise<TownSelect> {
    const rows = await this.db.context
      .update(town)
      .set(data)
      .where(eq(town.id, id))
      .returning();
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.context.delete(town).where(eq(town.id, id));
  }
}
