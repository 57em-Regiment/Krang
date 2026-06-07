import { Item } from '@/generated/client';
import { Database } from '@/infrastructure/database';
import { CreateItem, UpdateItem } from '@57eme-regiment/krang-api-contract';
import { injectable } from 'tsyringe';

@injectable()
export class ItemRepository {
  constructor(private readonly db: Database) {}
  findAll(search?: string, limit?: number): Promise<Item[]> {
    if (!search) {
      return this.db.context.item.findMany({
        take: limit,
        orderBy: { name: 'asc' },
      });
    }

    const take = limit ?? 25;
    const threshold = 0.1;
    return this.db.context.$queryRaw<Item[]>`
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
    `;
  }
  findById(id: string): Promise<Item | null> {
    return this.db.context.item.findUnique({ where: { id } });
  }
  create(data: CreateItem): Promise<Item> {
    return this.db.context.item.create({ data });
  }

  upsert(data: CreateItem): Promise<Item> {
    const { name, ...rest } = data;
    return this.db.context.item.upsert({
      where: { name },
      create: data,
      update: rest,
    });
  }

  upsertRange(data: CreateItem[]): Promise<Item[]> {
    return this.db.context.$transaction(
      data.map(({ name, ...rest }) =>
        this.db.context.item.upsert({
          where: { name },
          create: { name, ...rest },
          update: rest,
        }),
      ),
    );
  }

  update(id: string, data: UpdateItem): Promise<Item> {
    return this.db.context.item.update({ where: { id }, data });
  }
  async delete(id: string): Promise<void> {
    await this.db.context.item.delete({ where: { id } });
  }
}
