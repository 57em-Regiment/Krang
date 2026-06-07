import { Location } from '@/generated/client';
import { Database } from '@/infrastructure/database';
import {
  CreateLocation,
  LocationNames,
  LocationQuery,
  UpdateLocation,
} from '@57eme-regiment/krang-api-contract';
import { injectable } from 'tsyringe';


@injectable()
export class LocationRepository {
  constructor(private readonly db: Database) {}

  findAll(): Promise<Location[]> {
    return this.db.context.location.findMany({});
  }

  async findAllNames(query: LocationQuery): Promise<LocationNames[]> {
    const take = query.limit ?? 25;

    if (!query.search) {
      const results = await this.db.context.location.findMany({
        include: { region: true, town: true },
        take,
      });
      return results.map(r => ({
        id: r.id,
        regionId: r.regionId,
        region: r.region,
        townId: r.townId,
        town: { id: r.town.id, name: r.town.name },
        type: r.type,
        faction: r.faction,
      }));
    }

    const search = query.search;
    const threshold = 0.1;

    return this.db.context.$queryRaw<LocationNames[]>`
      SELECT
        l.id,
        l."regionId",
        jsonb_build_object('id', r.id, 'name', r.name, 'gameRegionId', r."gameRegionId") AS region,
        l."townId",
        jsonb_build_object('id', t.id, 'name', t.name) AS town,
        l.type,
        l.faction
      FROM "Location" l
      JOIN "Region" r ON r.id = l."regionId"
      JOIN "Town" t ON t.id = l."townId"
      WHERE
        similarity(r.name, ${search}) > ${threshold}
        OR similarity(t.name, ${search}) > ${threshold}
        OR r.name ILIKE ${'%' + search + '%'}
        OR t.name ILIKE ${'%' + search + '%'}
        OR l.type::text ILIKE ${'%' + search + '%'}
      ORDER BY
        GREATEST(
          similarity(r.name, ${search}),
          similarity(t.name, ${search})
        ) DESC
      LIMIT ${take}
    `;
  }

  findById(id: string): Promise<Location | null> {
    return this.db.context.location.findUnique({ where: { id } });
  }

  create(data: CreateLocation): Promise<Location> {
    return this.db.context.location.create({ data });
  }

  createRange(data: CreateLocation[]): Promise<Location[]> {
    return this.db.context.location.createManyAndReturn({ data });
  }

  upsertRange(data: CreateLocation[]): Promise<Location[]> {
    return this.db.context.$transaction(
      data.map(l =>
        this.db.context.location.upsert({
          where: { longitude_latitude: { longitude: l.longitude, latitude: l.latitude } },
          create: l,
          update: { type: l.type, faction: l.faction, flags: l.flags, viewDirection: l.viewDirection, townId: l.townId },
        }),
      ),
    );
  }

  update(id: string, data: UpdateLocation): Promise<Location> {
    return this.db.context.location.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.db.context.location.delete({ where: { id } });
  }
}
