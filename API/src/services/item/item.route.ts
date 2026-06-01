import { container } from '@/infrastructure/container';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { requirePermission } from '@57eme-regiment/auth-server';
import {
  ItemSchema,
  createItemSchema,
  itemParamsSchema,
  updateItemSchema,
} from '@57eme-regiment/krang-api-contract';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ItemController } from './item.controller';

const errorSchema = z.object({ message: z.string(), code: z.string() });

export async function itemRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(ItemController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/',
    {
      preHandler: requirePermission(PERMISSIONS.KRANG_ITEM_READ),
      schema: { response: { 200: z.array(ItemSchema) } },
    },
    ctrl.getAll.bind(ctrl),
  );

  server.get(
    '/:id',
    {
      schema: {
        params: itemParamsSchema,
        response: { 200: ItemSchema, 404: errorSchema },
      },
    },
    ctrl.getById.bind(ctrl),
  );

  server.post(
    '/',
    {
      schema: {
        body: createItemSchema,
        response: { 201: ItemSchema },
      },
    },
    ctrl.create.bind(ctrl),
  );

  server.post(
    '/upsert',
    {
      schema: {
        body: createItemSchema,
        response: { 200: ItemSchema },
      },
    },
    ctrl.upsert.bind(ctrl),
  );

  server.post(
    '/upsertRange',
    {
      schema: {
        body: createItemSchema.array(),
        response: { 200: ItemSchema.array() },
      },
    },
    ctrl.upsertRange.bind(ctrl),
  );

  server.put(
    '/:id',
    {
      schema: {
        params: itemParamsSchema,
        body: updateItemSchema,
        response: { 200: ItemSchema, 404: errorSchema },
      },
    },
    ctrl.update.bind(ctrl),
  );

  server.delete(
    '/:id',
    {
      schema: {
        params: itemParamsSchema,
        response: { 204: z.null(), 404: errorSchema },
      },
    },
    ctrl.delete.bind(ctrl),
  );
}
