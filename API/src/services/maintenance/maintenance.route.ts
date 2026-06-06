import { container } from '@/infrastructure/container';
import { maintenanceContract } from '@57eme-regiment/krang-api-contract/contracts/maintenance.contract';
import { declareRoute } from '@57eme-regiment/nabu-fastify';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { MaintenanceController } from './maintenance.controller';

export async function maintenanceRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(MaintenanceController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(
    server,
    maintenanceContract.renenutet,
    ctrl.renenutet.bind(ctrl),
  );
}
