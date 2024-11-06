import { jsonb, pgEnum, pgTable, serial, text, timestamp, varchar, integer, uniqueIndex, index } from "drizzle-orm/pg-core";

export const productLifecycle = pgEnum('product_lifecycle', ['Drafted', 'Development', 'Staging', 'Production', 'Deprecated ', 'EOL']);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 8 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  model: varchar("model", { length: 32 }).notNull(),
  version: varchar("version", { length: 32 }).notNull(),
  lifecycle: productLifecycle().default('Drafted'),
  capacities: text("capacities"),
  description: text("description"),
  schema: jsonb("schema"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("product_sku_index").on(t.sku),
  index("product_ver_index").on(t.version)
]);

export const deviceIdentifiers = pgTable("device_identifiers", {
  id: serial("id").primaryKey(),
  sn: varchar("sn", { length: 32 }).unique().notNull(),
  mac: varchar("mac", { length: 32 }).unique(),
  tag: varchar("tag", { length: 32 }).unique(),
  imei: varchar("imei", { length: 32 }).unique(),
  nalCode: varchar("nal_code", { length: 32 }).unique(),
  productSku: varchar("product_sku", { length: 8 }).references(() => products.sku),
  preSharedKey: text("pre_shared_key"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("dev_id_sn_uniq_index").on(t.sn),
  uniqueIndex("dev_id_mac_uniq_index").on(t.mac),
  uniqueIndex("dev_id_tag_uniq_index").on(t.tag),
  uniqueIndex("dev_id_imei_uniq_index").on(t.imei),
  index("dev_id_product_sku_index").on(t.productSku),
]);

export const digitalTwinStatus = pgEnum('digital_twin_status', ['Enabled', 'Disabled']);
export const digitalTwinConnectionStates = pgEnum('digital_twin_connection_states', ['Online', 'Offline']);

export const digitalTwins = pgTable("digital_twins", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull().unique(),
  deviceId: integer("device_id").notNull(),
  productSku: varchar("product_sku", { length: 8 }),
  status: digitalTwinStatus().default("Enabled"),
  connectionState: digitalTwinConnectionStates().default("Offline"),
  twin: jsonb("twin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("digital_twin_asset_id_uniq_index").on(t.assetId),
  index("digital_twin_device_id_index").on(t.deviceId),
  index("digital_twin_product_sku_index").on(t.productSku),
  index("digital_twin_status_index").on(t.status),
  index("digtial_twin_connectio_state_index").on(t.connectionState),
]);


