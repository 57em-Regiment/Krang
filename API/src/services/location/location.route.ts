import { container } from '@/infrastructure/container';
import {
  LocationSchema,
  createLocationSchema,
  locationParamsSchema,
  updateLocationSchema,
} from '@57eme-regiment/krang-api-contract';
import { ZodTypeProvider } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { LocationController } from './location.controller';

const errorSchema = z.object({ message: z.string(), code: z.string() });

export async function locationRoutes(app: FastifyInstance) {
  const ctrl = container.resolve(LocationController);
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/',
    {
      schema: { response: { 200: z.array(LocationSchema) } },
    },
    ctrl.getAll.bind(ctrl),
  );

  server.get(
    '/:id',
    {
      schema: {
        params: locationParamsSchema,
        response: { 200: LocationSchema, 404: errorSchema },
      },
    },
    ctrl.getById.bind(ctrl),
  );

  server.post(
    '/',
    {
      schema: {
        body: createLocationSchema,
        response: { 201: LocationSchema },
      },
    },
    ctrl.create.bind(ctrl),
  );

  server.post(
    '/Range',
    {
      schema: {
        body: createLocationSchema.array(),
        response: { 201: LocationSchema.array() },
      },
    },
    ctrl.createRange.bind(ctrl),
  );

  server.post(
    '/upsertRange',
    {
      schema: {
        body: createLocationSchema.array(),
        response: { 200: LocationSchema.array() },
      },
    },
    ctrl.upsertRange.bind(ctrl),
  );

  server.put(
    '/:id',
    {
      schema: {
        params: locationParamsSchema,
        body: updateLocationSchema,
        response: { 200: LocationSchema, 404: errorSchema },
      },
    },
    ctrl.update.bind(ctrl),
  );

  server.delete(
    '/:id',
    {
      schema: {
        params: locationParamsSchema,
        response: { 204: z.null(), 404: errorSchema },
      },
    },
    ctrl.delete.bind(ctrl),
  );
}
