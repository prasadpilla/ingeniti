import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const scheduleDevices = pgTable('schedule_devices', {
  scheduleId: uuid('schedule_id').notNull(),
  deviceId: uuid('device_id').notNull(),
});

// You can add functions to insert, delete, or fetch devices associated with a schedule here.
