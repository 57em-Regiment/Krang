import { container } from '@/infrastructure/container';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { requirePermission } from '@57eme-regiment/auth-server';
import { itemContract } from '@57eme-regiment/krang-api-contract';
import { declareRoute } from '@57eme-regiment/nabu-fastify';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { ItemController } from './item.controller';

export async function itemRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(ItemController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  declareRoute(server, itemContract.getAll, ctrl.getAll.bind(ctrl), {
    preHandler: requirePermission(PERMISSIONS.KRANG_ITEM_READ),
  });
  declareRoute(server, itemContract.getById, ctrl.getById.bind(ctrl));
  declareRoute(server, itemContract.create, ctrl.create.bind(ctrl));
  declareRoute(server, itemContract.upsert, ctrl.upsert.bind(ctrl));
  declareRoute(server, itemContract.upsertRange, ctrl.upsertRange.bind(ctrl));
  declareRoute(server, itemContract.update, ctrl.update.bind(ctrl));
  declareRoute(server, itemContract.delete, ctrl.delete.bind(ctrl));
}
