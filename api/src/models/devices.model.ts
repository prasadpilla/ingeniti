import { and, eq } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { db } from '../db/client';

export const devices = pgTable('devices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name'),
  model: text('model'),
  identifier: text('identifier'),
  createdAt: timestamp('created_at').defaultNow(),
});

export function getDevice(userId: string, deviceId: string) {
  return db
    .select()
    .from(devices)
    .where(and(eq(devices.userId, userId), eq(devices.id, deviceId)));
}

export function getDevices(userId: string) {
  return db.select().from(devices).where(eq(devices.userId, userId));
}

export type Device = typeof devices.$inferSelect;
