import { TownService } from '@/services/town/town.service';
import {
  CreateTown,
  TownParams,
  UpdateTown,
} from '@57eme-regiment/krang-api-contract';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';

@injectable()
export class TownController {
  constructor(private readonly townService: TownService) {}

  async getAll(_req: FastifyRequest, reply: FastifyReply) {
    const towns = await this.townService.getAll();
    return reply.send(towns);
  }

  async getById(
    req: FastifyRequest<{ Params: TownParams }>,
    reply: FastifyReply,
  ) {
    const town = await this.townService.getById(req.params.id);
    return reply.send(town);
  }

  async create(req: FastifyRequest<{ Body: CreateTown }>, reply: FastifyReply) {
    const town = await this.townService.create(req.body);
    return reply.status(201).send(town);
  }

  async createRange(
    req: FastifyRequest<{ Body: CreateTown[] }>,
    reply: FastifyReply,
  ) {
    const town = await this.townService.createRange(req.body);
    return reply.status(201).send(town);
  }

  async upsertRange(
    req: FastifyRequest<{ Body: CreateTown[] }>,
    reply: FastifyReply,
  ) {
    const towns = await this.townService.upsertRange(req.body);
    return reply.send(towns);
  }

  async update(
    req: FastifyRequest<{ Params: TownParams; Body: UpdateTown }>,
    reply: FastifyReply,
  ) {
    const town = await this.townService.update(req.params.id, req.body);
    return reply.send(town);
  }

  async delete(
    req: FastifyRequest<{ Params: TownParams }>,
    reply: FastifyReply,
  ) {
    await this.townService.delete(req.params.id);
    return reply.status(204).send();
  }
}
