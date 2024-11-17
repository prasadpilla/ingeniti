import { and, eq, InferSelectModel } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid, json } from 'drizzle-orm/pg-core';
import { db } from '../db/client';

export const schedules = pgTable(
  'schedules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deviceIds: json('device_ids').notNull(),
  },
  (table) => ({
    userIdIndex: index('schedules_user_id_idx').on(table.userId),
  })
);

export type SelectedSchedule = InferSelectModel<typeof schedules> & {
  deviceIds: string[];
};

export async function getSchedules(userId: string): Promise<SelectedSchedule[]> {
  const schedulesData = await db.select().from(schedules).where(eq(schedules.userId, userId));

  return schedulesData.map((schedule) => ({
    id: schedule.id,
    userId: schedule.userId,
    name: schedule.name,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
    deviceIds: Array.isArray(schedule.deviceIds) ? schedule.deviceIds : [],
  }));
}

export async function getAllSchedules(): Promise<SelectedSchedule[]> {
  const schedulesData = await db.select().from(schedules);

  return schedulesData.map((schedule) => ({
    id: schedule.id,
    userId: schedule.userId,
    name: schedule.name,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
    deviceIds: Array.isArray(schedule.deviceIds) ? schedule.deviceIds : [],
  }));
}

export async function getSchedule(userId: string, scheduleId: string): Promise<SelectedSchedule> {
  const scheduleData = await db
    .select()
    .from(schedules)
    .where(and(eq(schedules.userId, userId), eq(schedules.id, scheduleId)))
    .limit(1);

  const schedule = scheduleData[0];

  return {
    id: schedule.id,
    userId: schedule.userId,
    name: schedule.name,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
    deviceIds: Array.isArray(schedule.deviceIds) ? schedule.deviceIds : [],
  };
}

export async function insertSchedule(scheduleData: {
  userId: string;
  name: string;
  startTime: Date;
  endTime: Date;
  deviceIds: string[];
}): Promise<SelectedSchedule> {
  const schedule = await db
    .insert(schedules)
    .values({
      userId: scheduleData.userId,
      name: scheduleData.name,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      createdAt: new Date(),
      updatedAt: new Date(),
      deviceIds: scheduleData.deviceIds,
    })
    .returning();

  return {
    id: schedule[0].id,
    userId: schedule[0].userId,
    name: schedule[0].name,
    startTime: schedule[0].startTime,
    endTime: schedule[0].endTime,
    createdAt: schedule[0].createdAt,
    updatedAt: schedule[0].updatedAt,
    deviceIds: Array.isArray(schedule[0].deviceIds) ? schedule[0].deviceIds : [],
  };
}

// New function to update an existing schedule
export async function updateSchedule(scheduleData: {
  id: string;
  userId: string;
  name: string;
  startTime: Date;
  endTime: Date;
  deviceIds: string[];
}): Promise<SelectedSchedule | null> {
  const { id, userId, name, startTime, endTime, deviceIds } = scheduleData;

  const updatedSchedule = await db
    .update(schedules)
    .set({
      name,
      startTime,
      endTime,
      deviceIds,
      updatedAt: new Date(),
    })
    .where(and(eq(schedules.id, id), eq(schedules.userId, userId)))
    .returning();

  if (updatedSchedule.length === 0) {
    return null; // Schedule not found or not updated
  }

  return {
    id: updatedSchedule[0].id,
    userId: updatedSchedule[0].userId,
    name: updatedSchedule[0].name,
    startTime: updatedSchedule[0].startTime,
    endTime: updatedSchedule[0].endTime,
    createdAt: updatedSchedule[0].createdAt,
    updatedAt: updatedSchedule[0].updatedAt,
    deviceIds: Array.isArray(updatedSchedule[0].deviceIds) ? updatedSchedule[0].deviceIds : [],
  };
}

// New function to delete a schedule
export async function deleteSchedule(userId: string, scheduleId: string): Promise<boolean> {
  const result = await db
    .delete(schedules)
    .where(and(eq(schedules.id, scheduleId), eq(schedules.userId, userId)))
    .returning();

  return result.length > 0;
}
