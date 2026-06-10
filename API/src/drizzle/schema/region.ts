import {
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { location } from './location';
import { town } from './town';

export const region = pgTable(
  'Region',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    gameRegionId: integer(),
  },
  table => [
    index('Region_name_idx').using(
      'gin',
      table.name.asc().nullsLast().op('gin_trgm_ops'),
    ),
    uniqueIndex('Region_name_key').using(
      'btree',
      table.name.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const regionRelations = relations(region, ({ many }) => ({
  locations: many(location),
  towns: many(town),
}));
