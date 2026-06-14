import { location, region, town } from '@/drizzle/schema';
import {
  LocationInsert,
  LocationSelect,
  LocationUpdate,
} from '@/drizzle/schema/zod';
import { Database } from '@/infrastructure/database';
import {
  LocationNames,
  LocationQuery,
} from '@57eme-regiment/krang-api-contract';
import { eq, inArray, sql } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class LocationRepository {
  constructor(private readonly db: Database) {}

  findAll(): Promise<LocationSelect[]> {
    return this.db.context.select().from(location);
  }

  async findAllNames(query: LocationQuery): Promise<LocationNames[]> {
    const take = query.limit ?? 25;

    if (!query.search) {
      return this.db.context
        .select({
          id: location.id,
          regionId: location.regionId,
          icon: location.icon,
          region: {
            id: region.id,
            name: region.name,
            gameRegionId: region.gameRegionId,
          },
          townId: location.townId,
          town: {
            id: town.id,
            name: town.name,
          },
          type: location.type,
          faction: location.faction,
        })
        .from(location)
        .innerJoin(region, eq(location.regionId, region.id))
        .innerJoin(town, eq(location.townId, town.id))
        .$dynamic()
        .where(
          query.filterType?.length
            ? inArray(location.type, query.filterType)
            : undefined,
        )
        .limit(take);
    }

    const search = query.search;
    const threshold = 0.1;

    return this.db.context.execute(sql`
      SELECT
        l.id,
        l."regionId",
        l."icon",
        jsonb_build_object('id', r.id, 'name', r.name, 'gameRegionId', r."gameRegionId") AS region,
        l."townId",
        jsonb_build_object('id', t.id, 'name', t.name) AS town,
        l.type,
        l.faction
      FROM "Location" l
      JOIN "Region" r ON r.id = l."regionId"
      JOIN "Town" t ON t.id = l."townId"
      WHERE
        (
          similarity(r.name, ${search}) > ${threshold}
          OR similarity(t.name, ${search}) > ${threshold}
          OR r.name ILIKE ${'%' + search + '%'}
          OR t.name ILIKE ${'%' + search + '%'}
          OR l.type::text ILIKE ${'%' + search + '%'}
        )
        ${query.filterType?.length ? sql`AND l.type = ANY(${query.filterType})` : sql``}
      ORDER BY
        GREATEST(
          similarity(r.name, ${search}),
          similarity(t.name, ${search})
        ) DESC
      LIMIT ${take}
    `) as unknown as LocationNames[];
  }

  async findById(id: string): Promise<LocationSelect | null> {
    const rows = await this.db.context
      .select()
      .from(location)
      .where(eq(location.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  async create(data: LocationInsert): Promise<LocationSelect> {
    const rows = await this.db.context
      .insert(location)
      .values(data)
      .returning();
    return rows[0];
  }

  createRange(data: LocationInsert[]): Promise<LocationSelect[]> {
    return this.db.context.insert(location).values(data).returning();
  }

  upsertRange(data: LocationInsert[]): Promise<LocationSelect[]> {
    return this.db.context
      .insert(location)
      .values(data)
      .onConflictDoUpdate({
        target: [location.longitude, location.latitude],
        set: {
          type: sql`excluded."type"`,
          faction: sql`excluded."faction"`,
          flags: sql`excluded."flags"`,
          viewDirection: sql`excluded."viewDirection"`,
          townId: sql`excluded."townId"`,
        },
      })
      .returning();
  }

  async update(id: string, data: LocationUpdate): Promise<LocationSelect> {
    const rows = await this.db.context
      .update(location)
      .set(data)
      .where(eq(location.id, id))
      .returning();
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.context.delete(location).where(eq(location.id, id));
  }
}
