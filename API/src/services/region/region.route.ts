import { container } from '@/infrastructure/container';
import { regionContract } from '@57eme-regiment/krang-api-contract';
import { declareRoute } from '@57eme-regiment/nabu-fastify';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { RegionController } from './region.controller';

export async function regionRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(RegionController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, regionContract.getAll, ctrl.getAll.bind(ctrl));
  declareRoute(server, regionContract.getById, ctrl.getById.bind(ctrl));
  declareRoute(server, regionContract.create, ctrl.create.bind(ctrl));
  declareRoute(server, regionContract.createRange, ctrl.createRange.bind(ctrl));
  declareRoute(server, regionContract.upsert, ctrl.upsert.bind(ctrl));
  declareRoute(server, regionContract.upsertRange, ctrl.upsertRange.bind(ctrl));
  declareRoute(server, regionContract.update, ctrl.update.bind(ctrl));
  declareRoute(server, regionContract.delete, ctrl.delete.bind(ctrl));
}
