import { z } from 'zod';
import { FactionSchema, LocationTypeSchema } from '../enums';
import { RegionSchema } from './region.schema';
import { TownNameSchema } from './town.schema';

export const LocationSchema = z.object({
  id: z.uuid(),
  type: LocationTypeSchema,
  faction: FactionSchema,
  iconType: z.number().int(),
  icon: z.url().nullish(),
  flags: z.number().int(),
  viewDirection: z.number().int(),
  longitude: z.number(),
  latitude: z.number(),
  regionId: z.uuid(),
  townId: z.uuid(),
});
export type Location = z.infer<typeof LocationSchema>;

export const LocationNamesSchema = z.object({
  id: z.uuid(),

  regionId: z.uuid(),
  region: RegionSchema,

  townId: z.uuid(),
  town: TownNameSchema,

  type: LocationTypeSchema,
  faction: FactionSchema,
});
export type LocationNames = z.infer<typeof LocationNamesSchema>;

export const createLocationSchema = z.object({
  type: LocationTypeSchema,
  faction: FactionSchema,
  iconType: z.number().int().default(0),
  icon: z.url().nullable(),
  flags: z.number().int().default(0),
  viewDirection: z.number().int().default(0),
  longitude: z.number(),
  latitude: z.number(),
  regionId: z.uuid(),
  townId: z.uuid(),
});
export type CreateLocation = z.infer<typeof createLocationSchema>;

export const updateLocationSchema = createLocationSchema.partial();
export type UpdateLocation = z.infer<typeof updateLocationSchema>;

export const locationParamsSchema = z.object({
  id: z.uuid(),
});
export type LocationParams = z.infer<typeof locationParamsSchema>;
export const locationQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().optional(),
});
export type LocationQuery = z.infer<typeof locationQuerySchema>;
