import { Location } from '@/generated/client';
import { Database } from '@/infrastructure/database';
import {
  CreateLocation,
  UpdateLocation,
} from '@57eme-regiment/krang-api-contract';
import { injectable } from 'tsyringe';


@injectable()
export class LocationRepository {
  constructor(private readonly db: Database) {}

  findAll(): Promise<Location[]> {
    return this.db.context.location.findMany({});
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
