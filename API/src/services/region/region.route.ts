import { container } from '@/infrastructure/container';
import {
  RegionSchema,
  createRegionSchema,
  regionParamsSchema,
  updateRegionSchema,
} from '@57eme-regiment/krang-api-contract';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { RegionController } from './region.controller';

const errorSchema = z.object({ message: z.string(), code: z.string() });

export async function regionRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(RegionController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/',
    {
      schema: { response: { 200: z.array(RegionSchema) } },
    },
    ctrl.getAll.bind(ctrl),
  );

  server.get(
    '/:id',
    {
      schema: {
        params: regionParamsSchema,
        response: { 200: RegionSchema, 404: errorSchema },
      },
    },
    ctrl.getById.bind(ctrl),
  );

  server.post(
    '/',
    {
      schema: {
        body: createRegionSchema,
        response: { 201: RegionSchema },
      },
    },
    ctrl.create.bind(ctrl),
  );

  server.post(
    '/range',
    {
      schema: {
        body: createRegionSchema.array(),
        response: { 201: RegionSchema.array() },
      },
    },
    ctrl.createRange.bind(ctrl),
  );

  server.post(
    '/upsert',
    {
      schema: {
        body: createRegionSchema,
        response: { 200: RegionSchema },
      },
    },
    ctrl.upsert.bind(ctrl),
  );

  server.post(
    '/upsertRange',
    {
      schema: {
        body: createRegionSchema.array(),
        response: { 200: RegionSchema.array() },
      },
    },
    ctrl.upsertRange.bind(ctrl),
  );

  server.put(
    '/:id',
    {
      schema: {
        params: regionParamsSchema,
        body: updateRegionSchema,
        response: { 200: RegionSchema, 404: errorSchema },
      },
    },
    ctrl.update.bind(ctrl),
  );

  server.delete(
    '/:id',
    {
      schema: {
        params: regionParamsSchema,
        response: { 204: z.null(), 404: errorSchema },
      },
    },
    ctrl.delete.bind(ctrl),
  );
}
