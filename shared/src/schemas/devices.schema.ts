import { z } from 'zod';

export const deviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  model: z.string(),
  identifier: z.string(),
  createdAt: z.string(),
});

export type Device = z.infer<typeof deviceSchema>;
