ALTER TABLE "devices" RENAME COLUMN "tuya_device_id" TO "connector_device_id";--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "connector" text NOT NULL;