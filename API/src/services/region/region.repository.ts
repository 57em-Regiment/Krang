import { region } from '@/drizzle/schema';
import { RegionInsert, RegionSelect, RegionUpdate } from '@/drizzle/schema/zod';
import { Database } from '@/infrastructure/database';
import { eq, sql } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class RegionRepository {
  constructor(private readonly db: Database) {}

  findAll(): Promise<RegionSelect[]> {
    return this.db.context.select().from(region);
  }

  async findById(id: string): Promise<RegionSelect | null> {
    const rows = await this.db.context.select().from(region).where(eq(region.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async create(data: RegionInsert): Promise<RegionSelect> {
    const rows = await this.db.context.insert(region).values(data).returning();
    return rows[0];
  }

  createRange(data: RegionInsert[]): Promise<RegionSelect[]> {
    return this.db.context.insert(region).values(data).returning();
  }

  async update(id: string, data: RegionUpdate): Promise<RegionSelect> {
    const rows = await this.db.context
      .update(region)
      .set(data)
      .where(eq(region.id, id))
      .returning();
    return rows[0];
  }

  async upsert(data: RegionInsert): Promise<RegionSelect> {
    const { name, ...rest } = data;
    const rows = await this.db.context
      .insert(region)
      .values(data)
      .onConflictDoUpdate({ target: region.name, set: rest })
      .returning();
    return rows[0];
  }

  upsertRange(data: RegionInsert[]): Promise<RegionSelect[]> {
    return this.db.context
      .insert(region)
      .values(data)
      .onConflictDoUpdate({
        target: region.name,
        set: { gameRegionId: sql`excluded."gameRegionId"` },
      })
      .returning();
  }

  async delete(id: string): Promise<void> {
    await this.db.context.delete(region).where(eq(region.id, id));
  }
}
