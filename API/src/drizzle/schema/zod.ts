import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { item } from './item';
import { location } from './location';
import { region } from './region';
import { town } from './town';

// Zod schemas — pour la validation runtime
export const regionSelectSchema = createSelectSchema(region);
export const regionInsertSchema = createInsertSchema(region);
export const regionUpdateSchema = createUpdateSchema(region);

export const townSelectSchema = createSelectSchema(town);
export const townInsertSchema = createInsertSchema(town);
export const townUpdateSchema = createUpdateSchema(town);

export const itemSelectSchema = createSelectSchema(item);
export const itemInsertSchema = createInsertSchema(item);
export const itemUpdateSchema = createUpdateSchema(item);

export const locationSelectSchema = createSelectSchema(location);
export const locationInsertSchema = createInsertSchema(location);
export const locationUpdateSchema = createUpdateSchema(location);

// Types TypeScript — inférés directement depuis Drizzle (sans branding Zod v4)
export type RegionSelect = typeof region.$inferSelect;
export type RegionInsert = typeof region.$inferInsert;
export type RegionUpdate = Partial<RegionInsert>;

export type TownSelect = typeof town.$inferSelect;
export type TownInsert = typeof town.$inferInsert;
export type TownUpdate = Partial<TownInsert>;

export type ItemSelect = typeof item.$inferSelect;
export type ItemInsert = typeof item.$inferInsert;
export type ItemUpdate = Partial<ItemInsert>;

export type LocationSelect = typeof location.$inferSelect;
export type LocationInsert = typeof location.$inferInsert;
export type LocationUpdate = Partial<LocationInsert>;
