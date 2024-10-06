import { z } from 'zod';

export const deviceSchema = z.object({
  id: z.string(),
  serialNumber: z.string(),
  usage: z.string(),
  type: z.string(),
  name: z.string(),
  location: z.string(),
  averageEnergyCost: z.number().positive(),
  minOffTime: z.number().positive(),
  brownOutVoltageChange: z.number().positive(),
  brownOutFrequencyChange: z.number().positive(),
  utility: z.string(),
  country: z.string(),
  meterServiceId: z.string(),
  isConnectedToPrimaryDevice: z.boolean(),
  utilitySmartPanel: z.string().nullable(),
  countrySmartPanel: z.string().nullable(),
  meterServiceIdSmartPanel: z.string().nullable(),
  maxLoad: z.number().nullable(),
  isSwitchOn: z.boolean().nullable(),
  isOnline: z.boolean().nullable(),
});

export type Device = z.infer<typeof deviceSchema>;
