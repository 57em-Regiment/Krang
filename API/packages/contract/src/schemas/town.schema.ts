import { z } from 'zod';
import { MapMarkerTypeSchema } from '../enums';

export const TownSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  regionId: z.uuid(),
  mapMarkerType: MapMarkerTypeSchema,
});
export type Town = z.infer<typeof TownSchema>;

export const TownNameSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});
export type TownName = z.infer<typeof TownNameSchema>;

export const createTownSchema = z.object({
  name: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  regionId: z.uuid(),
  mapMarkerType: MapMarkerTypeSchema,
});
export type CreateTown = z.infer<typeof createTownSchema>;

export const updateTownSchema = createTownSchema.partial();
export type UpdateTown = z.infer<typeof updateTownSchema>;

export const townParamsSchema = z.object({
  id: z.uuid(),
});
export type TownParams = z.infer<typeof townParamsSchema>;
