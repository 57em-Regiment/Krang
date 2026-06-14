import {
  boolean,
  doublePrecision,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { faction } from './item';
import { region } from './region';
import { town } from './town';

export const locationType = pgEnum('LocationType', [
  'STORAGE_DEPOT',
  'SEAPORT',
  'AIRCRAFT_RUNWAY',
]);

export const location = pgTable(
  'Location',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    type: locationType().default('SEAPORT').notNull(),
    faction: faction().default('NEUTRAL').notNull(),

    iconType: integer().default(0).notNull(),
    icon: text(),
    flags: integer().default(0).notNull(),
    viewDirection: integer().default(0).notNull(),

    canStoreCreate: boolean().default(false),

    longitude: doublePrecision().notNull(), //X repésente Est-Ouest
    latitude: doublePrecision().notNull(), //Y Repésente Nord/Sud

    townId: uuid().notNull(),
    regionId: uuid().notNull(),
  },
  table => [
    uniqueIndex('Location_longitude_latitude_key').using(
      'btree',
      table.longitude.asc().nullsLast().op('float8_ops'),
      table.latitude.asc().nullsLast().op('float8_ops'),
    ),

    foreignKey({
      columns: [table.townId],
      foreignColumns: [town.id],
      name: 'Location_townId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),

    foreignKey({
      columns: [table.regionId],
      foreignColumns: [region.id],
      name: 'Location_regionId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const locationRelations = relations(location, ({ one }) => ({
  town: one(town, {
    fields: [location.townId],
    references: [town.id],
  }),
  region: one(region, {
    fields: [location.regionId],
    references: [region.id],
  }),
}));
