import { and, eq, gte, inArray, InferSelectModel, lte } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { db } from '../db/client';
import { devices } from './devices.model';

export const deviceEnergy = pgTable('device_energy', {
  id: uuid('id').primaryKey().defaultRandom(),
  deviceId: uuid('device_id')
    .notNull()
    .references(() => devices.id),
  userId: text('user_id').notNull(),
  energy: integer('energy_kwh').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

export type SelectedDeviceEnergy = InferSelectModel<typeof deviceEnergy>;

export async function insertDeviceEnergy(deviceEnergyData: {
  deviceId: string;
  userId: string;
  energy: number;
  timestamp: Date;
}): Promise<SelectedDeviceEnergy> {
  const energyRecord = await db
    .insert(deviceEnergy)
    .values({
      deviceId: deviceEnergyData.deviceId,
      userId: deviceEnergyData.userId,
      energy: deviceEnergyData.energy,
      timestamp: deviceEnergyData.timestamp,
    })
    .returning();

  return energyRecord[0];
}

export async function getDeviceEnergy(
  deviceIds: string[],
  userId: string,
  startDate: string,
  endDate: string
): Promise<SelectedDeviceEnergy[]> {
  return db
    .select({
      id: deviceEnergy.id,
      userId: deviceEnergy.userId,
      timestamp: deviceEnergy.timestamp,
      deviceId: deviceEnergy.deviceId,
      energy: deviceEnergy.energy,
    })
    .from(deviceEnergy)
    .innerJoin(devices, eq(deviceEnergy.deviceId, devices.id))
    .where(
      and(
        eq(deviceEnergy.userId, userId),
        inArray(deviceEnergy.deviceId, deviceIds),
        gte(deviceEnergy.timestamp, new Date(startDate)),
        lte(deviceEnergy.timestamp, new Date(endDate))
      )
    );
}
