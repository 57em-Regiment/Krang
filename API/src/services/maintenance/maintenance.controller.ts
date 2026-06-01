import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { MaintenanceService } from './maintenance.service';

@injectable()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  async renenutet(req: FastifyRequest, reply: FastifyReply) {
    await this.maintenanceService.renenutet();
    return reply.status(200).send();
  }
}
