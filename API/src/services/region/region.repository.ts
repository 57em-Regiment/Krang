import { Region } from '@/generated/client';
import { Database } from '@/infrastructure/database';
import { CreateRegion, UpdateRegion } from '@57eme-regiment/krang-api-contract';
import { injectable } from 'tsyringe';

@injectable()
export class RegionRepository {
  constructor(private readonly db: Database) {}

  findAll(): Promise<Region[]> {
    return this.db.context.region.findMany({});
  }

  findById(id: string): Promise<Region | null> {
    return this.db.context.region.findUnique({ where: { id } });
  }

  create(data: CreateRegion): Promise<Region> {
    return this.db.context.region.create({ data });
  }
  createRange(data: CreateRegion[]): Promise<Region[]> {
    return this.db.context.region.createManyAndReturn({ data });
  }

  update(id: string, data: UpdateRegion): Promise<Region> {
    return this.db.context.region.update({ where: { id }, data });
  }

  upsert(data: CreateRegion): Promise<Region> {
    const { name, ...rest } = data;
    return this.db.context.region.upsert({
      where: { name },
      create: data,
      update: rest,
    });
  }

  upsertRange(data: CreateRegion[]): Promise<Region[]> {
    return this.db.context.$transaction(
      data.map(({ name, ...rest }) =>
        this.db.context.region.upsert({
          where: { name },
          create: { name, ...rest },
          update: rest,
        }),
      ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.context.region.delete({ where: { id } });
  }
}
