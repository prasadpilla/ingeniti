ALTER TABLE "devices" ADD COLUMN "is_switch_on" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "is_online" boolean DEFAULT false NOT NULL;