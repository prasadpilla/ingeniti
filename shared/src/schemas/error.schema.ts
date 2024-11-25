import { z } from 'zod';

const genericErrorSchema = z.object({
  error: z.string().describe('The error message'),
});

export type GenericError = z.infer<typeof genericErrorSchema>;
