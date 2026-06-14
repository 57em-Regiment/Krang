DROP INDEX "Town_name_regionId_key";--> statement-breakpoint
ALTER TABLE "Location" ALTER COLUMN "townId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Location" ALTER COLUMN "regionId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Town" ALTER COLUMN "regionId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Location" ADD COLUMN "icon" text;--> statement-breakpoint
CREATE UNIQUE INDEX "Town_name_regionId_key" ON "Town" USING btree ("name" text_ops,"regionId" uuid_ops);