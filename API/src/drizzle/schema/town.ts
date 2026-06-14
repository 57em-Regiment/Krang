import {
  doublePrecision,
  foreignKey,
  index,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm/relations';
import { location } from './location';
import { region } from './region';

export const mapMarkerType = pgEnum('MapMarkerType', ['MAJOR', 'MINOR']);

export const town = pgTable(
  'Town',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),

    longitude: doublePrecision().notNull(), //X repésente Est-Ouest
    latitude: doublePrecision().notNull(), //Y Repésente Nord/Sud

    mapMarkerType: mapMarkerType().notNull(),

    regionId: uuid().notNull(),
  },
  table => [
    index('Town_name_idx').using(
      'gin',
      table.name.asc().nullsLast().op('gin_trgm_ops'),
    ),
    uniqueIndex('Town_name_regionId_key').using(
      'btree',
      table.name.asc().nullsLast().op('text_ops'),
      table.regionId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.regionId],
      foreignColumns: [region.id],
      name: 'Town_regionId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const townRelations = relations(town, ({ one, many }) => ({
  locations: many(location),
  region: one(region, {
    fields: [town.regionId],
    references: [region.id],
  }),
}));
