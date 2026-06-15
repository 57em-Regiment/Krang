import { z } from 'zod';

export const RegionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  gameName: z.string(),
  gameRegionId: z.number().int().nullable(),
});

export const createRegionSchema = z.object({
  name: z.string(),
  gameName: z.string(),
  gameRegionId: z.number().int().optional(),
});

export const updateRegionSchema = createRegionSchema.partial();

export const regionParamsSchema = z.object({
  id: z.uuid(),
});

export type Region = z.infer<typeof RegionSchema>;
export type CreateRegion = z.infer<typeof createRegionSchema>;
export type UpdateRegion = z.infer<typeof updateRegionSchema>;
export type RegionParams = z.infer<typeof regionParamsSchema>;
