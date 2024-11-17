CREATE TABLE IF NOT EXISTS "schedule_devices" (
	"schedule_id" uuid NOT NULL,
	"device_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"device_ids" json NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "schedules_user_id_idx" ON "schedules" USING btree ("user_id");