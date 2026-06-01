import { LocationService } from '@/services/location/location.service';
import {
  CreateLocation,
  LocationParams,
  UpdateLocation,
} from '@57eme-regiment/krang-api-contract';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';

@injectable()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  async getAll(_req: FastifyRequest, reply: FastifyReply) {
    const locations = await this.locationService.getAll();
    return reply.send(locations);
  }

  async getById(
    req: FastifyRequest<{ Params: LocationParams }>,
    reply: FastifyReply,
  ) {
    const location = await this.locationService.getById(req.params.id);
    return reply.send(location);
  }

  async create(
    req: FastifyRequest<{ Body: CreateLocation }>,
    reply: FastifyReply,
  ) {
    const location = await this.locationService.create(req.body);
    return reply.status(201).send(location);
  }

  async createRange(
    req: FastifyRequest<{ Body: CreateLocation[] }>,
    reply: FastifyReply,
  ) {
    const location = await this.locationService.createRange(req.body);
    return reply.status(201).send(location);
  }

  async upsertRange(
    req: FastifyRequest<{ Body: CreateLocation[] }>,
    reply: FastifyReply,
  ) {
    const locations = await this.locationService.upsertRange(req.body);
    return reply.send(locations);
  }

  async update(
    req: FastifyRequest<{ Params: LocationParams; Body: UpdateLocation }>,
    reply: FastifyReply,
  ) {
    const location = await this.locationService.update(req.params.id, req.body);
    return reply.send(location);
  }

  async delete(
    req: FastifyRequest<{ Params: LocationParams }>,
    reply: FastifyReply,
  ) {
    await this.locationService.delete(req.params.id);
    return reply.status(204).send();
  }
}
