import { and, eq, InferSelectModel } from 'drizzle-orm';
import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { db } from '../db/client';

export const devices = pgTable(
  'devices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    identifier: text('identifier'),
    serialNumber: text('serial_number').notNull(),
    usage: text('usage').notNull(),
    type: text('type').notNull(),
    location: text('location').notNull(),
    averageEnergyCost: integer('average_energy_cost').notNull(),
    minOffTime: integer('min_off_time').notNull(),
    brownOutVoltageChange: integer('brown_out_voltage_change').notNull(),
    brownOutFrequencyChange: integer('brown_out_frequency_change').notNull(),
    utility: text('utility').notNull(),
    country: text('country').notNull(),
    meterServiceId: text('meter_service_id').notNull(),
    isConnectedToPrimaryDevice: boolean('is_connected_to_primary_device').notNull().default(true),
    utilitySmartPanel: text('utility_smart_panel'),
    countrySmartPanel: text('country_smart_panel'),
    meterServiceIdSmartPanel: text('meter_service_id_smart_panel'),
    maxLoad: integer('max_load'),
    isSwitchOn: boolean('is_switch_on').notNull().default(false),
    isOnline: boolean('is_online').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    tuyaDeviceId: text('tuya_device_id'),
  },
  (table) => ({
    userIdIndex: index('user_id_idx').on(table.userId),
  })
);

export type SelectedDevice = InferSelectModel<typeof devices>;

export async function getDevices(userId: string): Promise<SelectedDevice[]> {
  return db.select().from(devices).where(eq(devices.userId, userId));
}

export async function getDevice(userId: string, deviceId: string): Promise<SelectedDevice> {
  const device = await db
    .select()
    .from(devices)
    .where(and(eq(devices.userId, userId), eq(devices.id, deviceId)))
    .limit(1);

  return device[0];
}

export async function updateDevice(
  userId: string,
  deviceId: string,
  deviceData: { isSwitchOn: boolean; tuyaDeviceId?: string }
): Promise<SelectedDevice> {
  const [device] = await db
    .update(devices)
    .set({
      isSwitchOn: deviceData.isSwitchOn,
      updatedAt: new Date(),
      tuyaDeviceId: deviceData.tuyaDeviceId,
    })
    .where(and(eq(devices.id, deviceId), eq(devices.userId, userId)))
    .returning();

  return device;
}

export async function insertDevice(deviceData: {
  userId: string;
  name: string;
  identifier: string | undefined;
  serialNumber: string;
  usage: string;
  type: string;
  location: string;
  averageEnergyCost: number;
  minOffTime: number;
  brownOutVoltageChange: number;
  brownOutFrequencyChange: number;
  utility: string;
  country: string;
  meterServiceId: string;
  isConnectedToPrimaryDevice: boolean;
  utilitySmartPanel: string | undefined;
  countrySmartPanel: string | undefined;
  meterServiceIdSmartPanel: string | undefined;
  maxLoad: number | undefined;
  isSwitchOn: boolean;
  isOnline: boolean;
  tuyaDeviceId?: string;
}): Promise<SelectedDevice> {
  const device = await db
    .insert(devices)
    .values({
      userId: deviceData.userId,
      name: deviceData.name,
      identifier: deviceData.identifier,
      serialNumber: deviceData.serialNumber,
      usage: deviceData.usage,
      type: deviceData.type,
      location: deviceData.location,
      averageEnergyCost: deviceData.averageEnergyCost,
      minOffTime: deviceData.minOffTime,
      brownOutVoltageChange: deviceData.brownOutVoltageChange,
      brownOutFrequencyChange: deviceData.brownOutFrequencyChange,
      utility: deviceData.utility,
      country: deviceData.country,
      meterServiceId: deviceData.meterServiceId,
      isConnectedToPrimaryDevice: deviceData.isConnectedToPrimaryDevice,
      utilitySmartPanel: deviceData.utilitySmartPanel,
      countrySmartPanel: deviceData.countrySmartPanel,
      meterServiceIdSmartPanel: deviceData.meterServiceIdSmartPanel,
      maxLoad: deviceData.maxLoad,
      isSwitchOn: deviceData.isSwitchOn,
      isOnline: deviceData.isOnline,
      createdAt: new Date(),
      updatedAt: new Date(),
      tuyaDeviceId: deviceData.tuyaDeviceId,
    })
    .returning();

  return device[0];
}

export async function getAllDevices(): Promise<SelectedDevice[]> {
  return db.select().from(devices);
}
