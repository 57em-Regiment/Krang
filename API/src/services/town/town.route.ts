import { container } from '@/infrastructure/container';
import {
  TownSchema,
  createTownSchema,
  townParamsSchema,
  updateTownSchema,
} from '@57eme-regiment/krang-api-contract';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { TownController } from './town.controller';

const errorSchema = z.object({ message: z.string(), code: z.string() });

export async function townRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(TownController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/',
    {
      schema: { response: { 200: z.array(TownSchema) } },
    },
    ctrl.getAll.bind(ctrl),
  );

  server.get(
    '/:id',
    {
      schema: {
        params: townParamsSchema,
        response: { 200: TownSchema, 404: errorSchema },
      },
    },
    ctrl.getById.bind(ctrl),
  );

  server.post(
    '/',
    {
      schema: {
        body: createTownSchema,
        response: { 201: TownSchema },
      },
    },
    ctrl.create.bind(ctrl),
  );

  server.post(
    '/Range',
    {
      schema: {
        body: createTownSchema.array(),
        response: { 201: TownSchema.array() },
      },
    },
    ctrl.createRange.bind(ctrl),
  );

  server.post(
    '/upsertRange',
    {
      schema: {
        body: createTownSchema.array(),
        response: { 200: TownSchema.array() },
      },
    },
    ctrl.upsertRange.bind(ctrl),
  );

  server.put(
    '/:id',
    {
      schema: {
        params: townParamsSchema,
        body: updateTownSchema,
        response: { 200: TownSchema, 404: errorSchema },
      },
    },
    ctrl.update.bind(ctrl),
  );

  server.delete(
    '/:id',
    {
      schema: {
        params: townParamsSchema,
        response: { 204: z.null(), 404: errorSchema },
      },
    },
    ctrl.delete.bind(ctrl),
  );
}
