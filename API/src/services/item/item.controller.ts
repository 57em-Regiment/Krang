import { ItemService } from '@/services/item/item.service';
import {
  CreateItem,
  ItemParams,
  UpdateItem,
} from '@57eme-regiment/krang-api-contract';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';

@injectable()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  async getAll(_req: FastifyRequest, reply: FastifyReply) {
    const items = await this.itemService.getAll();
    return reply.send(items);
  }

  async getById(
    req: FastifyRequest<{ Params: ItemParams }>,
    reply: FastifyReply,
  ) {
    const item = await this.itemService.getById(req.params.id);
    return reply.send(item);
  }

  async create(req: FastifyRequest<{ Body: CreateItem }>, reply: FastifyReply) {
    const item = await this.itemService.create(req.body);
    return reply.status(201).send(item);
  }

  async upsert(req: FastifyRequest<{ Body: CreateItem }>, reply: FastifyReply) {
    const item = await this.itemService.upsert(req.body);
    return reply.send(item);
  }

  async upsertRange(
    req: FastifyRequest<{ Body: CreateItem[] }>,
    reply: FastifyReply,
  ) {
    const items = await this.itemService.upsertRange(req.body);
    return reply.send(items);
  }

  async update(
    req: FastifyRequest<{ Params: ItemParams; Body: UpdateItem }>,
    reply: FastifyReply,
  ) {
    const item = await this.itemService.update(req.params.id, req.body);
    return reply.send(item);
  }

  async delete(
    req: FastifyRequest<{ Params: ItemParams }>,
    reply: FastifyReply,
  ) {
    await this.itemService.delete(req.params.id);
    return reply.status(204).send();
  }
}
