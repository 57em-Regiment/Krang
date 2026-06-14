import { z } from 'zod';
import {
  CategorySchema,
  ClassSchema,
  FactionSchema,
  SuperClassSchema,
} from '../enums';

export const ItemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  shortName: z.string().nullable(),
  category: CategorySchema,
  superClass: SuperClassSchema,
  class: ClassSchema,
  faction: FactionSchema,
  nbByCrate: z.number().int(),
  maxQuantity: z.number().int(),
  icon: z.string().nullable(),
  attributes: z.record(z.string(), z.any()).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Item = z.infer<typeof ItemSchema>;

export const createItemSchema = z.object({
  name: z.string(),
  shortName: z.string().optional(),
  category: CategorySchema,
  superClass: SuperClassSchema,
  class: ClassSchema,
  faction: FactionSchema,
  nbByCrate: z.number().int().default(100),
  maxQuantity: z.number().int().default(300),
  icon: z.url().nullish(),
  attributes: z.record(z.string(), z.any()).optional(),
});
export type CreateItem = z.infer<typeof createItemSchema>;

export const updateItemSchema = createItemSchema.partial();
export type UpdateItem = z.infer<typeof updateItemSchema>;

export const itemParamsSchema = z.object({
  id: z.uuid(),
});
export type ItemParams = z.infer<typeof itemParamsSchema>;

export const itemQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
export type ItemQuery = z.infer<typeof itemQuerySchema>;
