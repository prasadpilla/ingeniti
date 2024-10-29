import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { db } from '../db/client';
import { and, eq, gte, lte, inArray } from 'drizzle-orm';
import { devices } from './devices.model';
import { InferSelectModel } from 'drizzle-orm';

export const deviceEnergy = pgTable('device_energy', {
  id: uuid('id').primaryKey().defaultRandom(),
  deviceId: uuid('device_id')
    .notNull()
    .references(() => devices.id),
  userId: text('user_id').notNull(),
  energy: integer('energy_kwh').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type SelectedDeviceEnergy = InferSelectModel<typeof deviceEnergy>;

export async function insertDeviceEnergy(deviceEnergyData: {
  deviceId: string;
  userId: string;
  energy: number;
}): Promise<SelectedDeviceEnergy> {
  const energyRecord = await db
    .insert(deviceEnergy)
    .values({
      deviceId: deviceEnergyData.deviceId,
      userId: deviceEnergyData.userId,
      energy: deviceEnergyData.energy,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      createdAt: deviceEnergy.createdAt,
      updatedAt: deviceEnergy.updatedAt,
      deviceId: deviceEnergy.deviceId,
      energy: deviceEnergy.energy,
    })
    .from(deviceEnergy)
    .innerJoin(devices, eq(deviceEnergy.deviceId, devices.id))
    .where(
      and(
        eq(deviceEnergy.userId, userId),
        inArray(deviceEnergy.deviceId, deviceIds),
        gte(deviceEnergy.createdAt, new Date(startDate)),
        lte(deviceEnergy.createdAt, new Date(endDate))
      )
    );
}
