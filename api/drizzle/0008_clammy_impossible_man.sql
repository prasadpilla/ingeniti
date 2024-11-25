ALTER TABLE "device_energy" ADD COLUMN "timestamp" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "device_energy" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "device_energy" DROP COLUMN IF EXISTS "updated_at";