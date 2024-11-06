CREATE TYPE "public"."digital_twin_connection_states" AS ENUM('Online', 'Offline');--> statement-breakpoint
CREATE TYPE "public"."digital_twin_status" AS ENUM('Enabled', 'Disabled');--> statement-breakpoint
CREATE TYPE "public"."product_lifecycle" AS ENUM('Drafted', 'Development', 'Staging', 'Production', 'Deprecated ', 'EOL');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "device_identifiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"sn" varchar(32) NOT NULL,
	"mac" varchar(32),
	"tag" varchar(32),
	"imei" varchar(32),
	"nal_code" varchar(32),
	"product_sku" varchar(8),
	"pre_shared_key" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "device_identifiers_sn_unique" UNIQUE("sn"),
	CONSTRAINT "device_identifiers_mac_unique" UNIQUE("mac"),
	CONSTRAINT "device_identifiers_tag_unique" UNIQUE("tag"),
	CONSTRAINT "device_identifiers_imei_unique" UNIQUE("imei"),
	CONSTRAINT "device_identifiers_nal_code_unique" UNIQUE("nal_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_twins" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"device_id" integer NOT NULL,
	"product_sku" varchar(8),
	"status" "digital_twin_status" DEFAULT 'Enabled',
	"connectionState" "digital_twin_connection_states" DEFAULT 'Offline',
	"twin" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "digital_twins_asset_id_unique" UNIQUE("asset_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" varchar(8) NOT NULL,
	"name" varchar(255) NOT NULL,
	"model" varchar(32) NOT NULL,
	"version" varchar(32) NOT NULL,
	"lifecycle" "product_lifecycle" DEFAULT 'Drafted',
	"capacities" text,
	"description" text,
	"schema" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "device_identifiers" ADD CONSTRAINT "device_identifiers_product_sku_products_sku_fk" FOREIGN KEY ("product_sku") REFERENCES "public"."products"("sku") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "dev_id_sn_uniq_index" ON "device_identifiers" USING btree ("sn");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "dev_id_mac_uniq_index" ON "device_identifiers" USING btree ("mac");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "dev_id_tag_uniq_index" ON "device_identifiers" USING btree ("tag");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "dev_id_imei_uniq_index" ON "device_identifiers" USING btree ("imei");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dev_id_product_sku_index" ON "device_identifiers" USING btree ("product_sku");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "digital_twin_asset_id_uniq_index" ON "digital_twins" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "digital_twin_device_id_index" ON "digital_twins" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "digital_twin_product_sku_index" ON "digital_twins" USING btree ("product_sku");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "digital_twin_status_index" ON "digital_twins" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "digital_twin_connection_state_index" ON "digital_twins" USING btree ("connectionState");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_sku_index" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_ver_index" ON "products" USING btree ("version");