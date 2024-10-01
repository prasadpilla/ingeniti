import { and, eq } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, numeric, boolean } from 'drizzle-orm/pg-core';
import { db } from '../db/client';
import { DeviceOnBoardingForm } from '@ingeniti/shared';

export const devices = pgTable('devices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  model: text('model').notNull(),
  identifier: text('identifier').notNull(),
  serialNumber: text('serial_number').notNull(),
  usage: text('usage').notNull(),
  type: text('type').notNull(),
  location: text('location').notNull(),
  averageEnergyCost: numeric('average_energy_cost').notNull(),
  minOffTime: numeric('min_off_time').notNull(),
  brownOutVoltageChange: numeric('brown_out_voltage_change').notNull(),
  brownOutFrequencyChange: numeric('brown_out_frequency_change').notNull(),
  utility: text('utility').notNull(),
  country: text('country').notNull(),
  meterServiceID: text('meter_service_id').notNull(),
  isConnectedToPrimaryDevice: boolean('is_connected_to_primary_device').notNull(),
  utilitySmartPanel: text('utility_smart_panel').notNull(),
  countrySmartPanel: text('country_smart_panel').notNull(),
  meterServiceIDSmartPanel: text('meter_service_id_smart_panel').notNull(),
  maxLoad: numeric('max_load').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Device = typeof devices.$inferSelect;

export function getDevice(userId: string, deviceId: string) {
  return db
    .select()
    .from(devices)
    .where(and(eq(devices.userId, userId), eq(devices.id, deviceId)));
}

export function getDevices(userId: string) {
  return db.select().from(devices).where(eq(devices.userId, userId));
}

export async function insertDevice({ userId, ...data }: { userId: string } & DeviceOnBoardingForm): Promise<Device> {
  const device = await db
    .insert(devices)
    .values({
      userId: userId,
      name: data.name,
      identifier: data.identifier,
      serialNumber: data.serialNumber,
      usage: data.usage,
      type: data.type,
      location: data.location,
      averageEnergyCost: data.averageEnergyCost,
      minOffTime: data.minOffTime,
      brownOutVoltageChange: data.brownOutVoltageChange,
      brownOutFrequencyChange: data.brownOutFrequencyChange,
      utility: data.utility,
      country: data.country,
      meterServiceID: data.meterServiceID,
      isConnectedToPrimaryDevice: data.isConnectedToPrimaryDevice,
      utilitySmartPanel: data.utilitySmartPanel,
      countrySmartPanel: data.countrySmartPanel,
      meterServiceIDSmartPanel: data.meterServiceIDSmartPanel,
      maxLoad: data.maxLoad,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return device;
}
