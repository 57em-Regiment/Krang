ALTER TABLE "Location" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Location" ALTER COLUMN "type" SET DEFAULT 'SPAWN_STORAGE'::text;--> statement-breakpoint
DROP TYPE "public"."LocationType";--> statement-breakpoint
CREATE TYPE "public"."LocationType" AS ENUM('SPAWN_STORAGE', 'FORWARD_BASE', 'MEDICAL_BASE', 'PRODUCTION', 'NEUTRAL_STRUCTURE', 'WORLD_STRUCTURE', 'RESOURCE_FIELD', 'AUTOMATED_DEFENSE', 'RESOURCE_HARVESTER', 'STORAGE', 'HOME_BASE', 'PLAYER_MANNED_DEFENSE', 'UTILITY');--> statement-breakpoint
ALTER TABLE "Location" ALTER COLUMN "type" SET DEFAULT 'SPAWN_STORAGE'::"public"."LocationType";--> statement-breakpoint
ALTER TABLE "Location" ALTER COLUMN "type" SET DATA TYPE "public"."LocationType" USING "type"::"public"."LocationType";--> statement-breakpoint
ALTER TABLE "Location" DROP COLUMN "canStoreCreate";