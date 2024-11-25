ALTER TABLE "devices" ALTER COLUMN "is_connected_to_primary_device" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "devices" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "devices" USING btree ("user_id");