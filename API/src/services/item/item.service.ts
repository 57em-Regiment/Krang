import { Item } from '@/generated/client';
import { ItemRepository } from '@/services/item/item.repository';
import { AppError } from '@/shared/errors/appError';
import { CreateItem, UpdateItem } from '@57eme-regiment/krang-api-contract';
import { injectable } from 'tsyringe';

@injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async getAll(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }

  async getById(id: string): Promise<Item> {
    const item = await this.itemRepository.findById(id);
    if (!item) throw new AppError('Item not found', 404, 'ITEM_NOT_FOUND');
    return item;
  }

  async create(data: CreateItem): Promise<Item> {
    return this.itemRepository.create(data);
  }

  async upsert(data: CreateItem): Promise<Item> {
    return this.itemRepository.upsert(data);
  }

  async upsertRange(data: CreateItem[]): Promise<Item[]> {
    return this.itemRepository.upsertRange(data);
  }

  async update(id: string, data: UpdateItem): Promise<Item> {
    await this.getById(id);
    return this.itemRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.itemRepository.delete(id);
  }
}
