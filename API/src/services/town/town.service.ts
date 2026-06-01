import { Town } from '@/generated/client';
import { TownRepository } from '@/services/town/town.repository';
import { AppError } from '@/shared/errors/appError';
import { CreateTown, UpdateTown } from '@57eme-regiment/krang-api-contract';
import { injectable } from 'tsyringe';

@injectable()
export class TownService {
  constructor(private readonly townRepository: TownRepository) {}

  async getAll(): Promise<Town[]> {
    return this.townRepository.findAll();
  }

  async getById(id: string): Promise<Town> {
    const town = await this.townRepository.findById(id);
    if (!town) throw new AppError('Town not found', 404, 'TOWN_NOT_FOUND');
    return town;
  }

  async create(data: CreateTown): Promise<Town> {
    return this.townRepository.create(data);
  }

  async createRange(data: CreateTown[]): Promise<Town[]> {
    return this.townRepository.createRange(data);
  }

  async upsertRange(data: CreateTown[]): Promise<Town[]> {
    return this.townRepository.upsertRange(data);
  }

  async update(id: string, data: UpdateTown): Promise<Town> {
    await this.getById(id);
    return this.townRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.townRepository.delete(id);
  }
}
