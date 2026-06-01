import { container } from '@/infrastructure/container';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { MaintenanceController } from './maintenance.controller';

export async function maintenanceRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(MaintenanceController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    '/',
    {
      schema: {
        response: { 200: z.undefined() },
      },
    },
    ctrl.renenutet.bind(ctrl),
  );
}
