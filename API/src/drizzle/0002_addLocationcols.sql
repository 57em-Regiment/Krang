ALTER TYPE "public"."LocationType" ADD VALUE 'AIRCRAFT_RUNWAY';--> statement-breakpoint
ALTER TABLE "Location" ADD COLUMN "canStoreCreate" boolean DEFAULT false;