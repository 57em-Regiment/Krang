import { item } from '@/drizzle/schema';
import { ItemInsert, ItemSelect, ItemUpdate } from '@/drizzle/schema/zod';
import { Database } from '@/infrastructure/database';
import { asc, eq, sql } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class ItemRepository {
  constructor(private readonly db: Database) {}

  async findAll(search?: string, limit?: number): Promise<ItemSelect[]> {
    if (!search) {
      return this.db.context.select().from(item).orderBy(asc(item.name)).limit(limit ?? 10000);
    }

    const take = limit ?? 25;
    const threshold = 0.1;
    return this.db.context.execute(sql`
      SELECT * FROM "Item"
      WHERE
        similarity(name, ${search}) > ${threshold}
        OR similarity(COALESCE("shortName", ''), ${search}) > ${threshold}
        OR name ILIKE ${'%' + search + '%'}
        OR "shortName" ILIKE ${'%' + search + '%'}
      ORDER BY
        GREATEST(
          similarity(name, ${search}),
          similarity(COALESCE("shortName", ''), ${search})
        ) DESC
      LIMIT ${take}
    `) as unknown as ItemSelect[];
  }

  async findById(id: string): Promise<ItemSelect | null> {
    const rows = await this.db.context.select().from(item).where(eq(item.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async create(data: ItemInsert): Promise<ItemSelect> {
    const rows = await this.db.context.insert(item).values(data).returning();
    return rows[0];
  }

  async upsert(data: ItemInsert): Promise<ItemSelect> {
    const { name, ...rest } = data;
    const rows = await this.db.context
      .insert(item)
      .values(data)
      .onConflictDoUpdate({ target: item.name, set: rest })
      .returning();
    return rows[0];
  }

  upsertRange(data: ItemInsert[]): Promise<ItemSelect[]> {
    return this.db.context
      .insert(item)
      .values(data)
      .onConflictDoUpdate({
        target: item.name,
        set: {
          shortName: sql`excluded."shortName"`,
          category: sql`excluded."category"`,
          superClass: sql`excluded."superClass"`,
          class: sql`excluded."class"`,
          faction: sql`excluded."faction"`,
          nbByCrate: sql`excluded."nbByCrate"`,
          maxQuantity: sql`excluded."maxQuantity"`,
          icon: sql`excluded."icon"`,
          attributes: sql`excluded."attributes"`,
          updatedAt: sql`now()`,
        },
      })
      .returning();
  }

  async update(id: string, data: ItemUpdate): Promise<ItemSelect> {
    const rows = await this.db.context
      .update(item)
      .set({ ...data, updatedAt: sql`now()` })
      .where(eq(item.id, id))
      .returning();
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.context.delete(item).where(eq(item.id, id));
  }
}
