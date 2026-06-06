import { container } from '@/infrastructure/container';
import { locationContract } from '@57eme-regiment/krang-api-contract';
import { declareRoute } from '@57eme-regiment/nabu-fastify';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { LocationController } from './location.controller';

export async function locationRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(LocationController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, locationContract.getAll, ctrl.getAll.bind(ctrl));
  declareRoute(server, locationContract.getById, ctrl.getById.bind(ctrl));
  declareRoute(server, locationContract.getNames, ctrl.getNames.bind(ctrl));
  declareRoute(server, locationContract.create, ctrl.create.bind(ctrl));
  declareRoute(server, locationContract.createRange, ctrl.createRange.bind(ctrl));
  declareRoute(server, locationContract.upsertRange, ctrl.upsertRange.bind(ctrl));
  declareRoute(server, locationContract.update, ctrl.update.bind(ctrl));
  declareRoute(server, locationContract.delete, ctrl.delete.bind(ctrl));
}
