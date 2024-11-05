import { z } from 'zod';

export const energyDataSchema = z.object({
  id: z.string(),
  userId: z.string(),
  deviceId: z.string(),
  deviceName: z.string(),
  energy: z.number(),
  timestamp: z.string(),
});

export const energyResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(energyDataSchema),
  interval: z.enum(['hourly', 'daily', 'weekly', 'monthly']),
});

export type EnergyData = z.infer<typeof energyDataSchema>;
export type EnergyResponse = z.infer<typeof energyResponseSchema>;
