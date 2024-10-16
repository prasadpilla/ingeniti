ALTER TABLE "devices" ALTER COLUMN "identifier" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ALTER COLUMN "utility_smart_panel" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ALTER COLUMN "country_smart_panel" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ALTER COLUMN "meter_service_id_smart_panel" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ALTER COLUMN "max_load" DROP NOT NULL;