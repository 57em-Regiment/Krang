import { Town } from '@/generated/client';
import { Database } from '@/infrastructure/database';
import { CreateTown, UpdateTown } from '@57eme-regiment/krang-api-contract';
import { injectable } from 'tsyringe';

@injectable()
export class TownRepository {
  constructor(private readonly db: Database) {}

  findAll(): Promise<Town[]> {
    return this.db.context.town.findMany({});
  }

  findById(id: string): Promise<Town | null> {
    return this.db.context.town.findUnique({ where: { id } });
  }

  create(data: CreateTown): Promise<Town> {
    return this.db.context.town.create({ data });
  }

  createRange(data: CreateTown[]): Promise<Town[]> {
    return this.db.context.town.createManyAndReturn({ data });
  }

  upsertRange(data: CreateTown[]): Promise<Town[]> {
    return this.db.context.$transaction(
      data.map(t =>
        this.db.context.town.upsert({
          where: { name_regionId: { name: t.name, regionId: t.regionId } },
          create: t,
          update: { longitude: t.longitude, latitude: t.latitude, mapMarkerType: t.mapMarkerType },
        }),
      ),
    );
  }

  update(id: string, data: UpdateTown): Promise<Town> {
    return this.db.context.town.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.db.context.town.delete({ where: { id } });
  }
}
