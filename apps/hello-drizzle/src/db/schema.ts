import { jsonb, pgEnum, pgTable, serial, text, timestamp, varchar, integer, uniqueIndex, index, bigint, smallint } from "drizzle-orm/pg-core";

export const productLifecycle = pgEnum('product_lifecycle', ['Drafted', 'Development', 'Staging', 'Production', 'Deprecated ', 'EOL']);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 8 }).notNull().unique(),
  model: varchar("model", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  version: varchar("version", { length: 32 }).notNull(),
  lifecycle: productLifecycle().default('Drafted'),
  capacities: text("capacities"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productProperties = pgTable("product_properties", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  propertyId: smallint("property_id").notNull(),
  propertyName: varchar("property_name", { length: 255 }).notNull(),
  propertyValueSchema: jsonb("property_value_schema").notNull(),
  propertyTransformer: text("property_transformer"),
  propertyDisplayName: varchar("property_display_name", { length: 255 }),
  propertyUnit: varchar("property_unit", { length: 32 }),
  propertyRemarks: text("property_remarks"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("product_property_uniq_id").on(t.productId, t.propertyId),
])


export const deviceEnrollment = pgTable("device_enrollment", {
  id: serial("id").primaryKey(),
  sn: varchar("sn", { length: 32 }).unique().notNull(),
  mac: varchar("mac", { length: 32 }).unique(),
  imei: varchar("imei", { length: 32 }).unique(),
  code: varchar("code", { length: 32 }),  // reserved for extension, such as NAL or User-defined code
  secret: text("secret"),
  certificate: text("certificate"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("device_enrollment_sn_uniq_index").on(t.sn),
  uniqueIndex("device_enrollment_mac_uniq_index").on(t.mac),
  uniqueIndex("device_enrollment_imei_uniq_index").on(t.imei),
  uniqueIndex("device_enrollment_code_uniq_index").on(t.code),
]);


export const deviceSubscriptions = pgTable("device_subscriptions", {
  id: serial("id").primaryKey(),

}, (t) => [])


export const digitalTwinStatus = pgEnum('digital_twin_status', ['Enabled', 'Disabled']);
export const digitalTwinConnectionStates = pgEnum('digital_twin_connection_states', ['Online', 'Offline']);

export const digitalTwins = pgTable("digital_twins", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").notNull(),
  productId: integer("product_id").references(() => products.id),
  assetId: integer("asset_id"),
  status: digitalTwinStatus().default("Enabled"),
  connectionState: digitalTwinConnectionStates().default("Offline"),
  twin: jsonb("twin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("digital_twin_asset_id_uniq_index").on(t.deviceId, t.assetId),
  index("digital_twin_device_id_index").on(t.deviceId),
  index("digital_twin_product_id_index").on(t.productId, t.deviceId),
]);

export const telemetries = pgTable("telemetries", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  deviceId: integer("device_id").notNull(),
  assetId: integer("asset_id"),
  timestamp: bigint("timestamp", { mode: "number" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [

]) 