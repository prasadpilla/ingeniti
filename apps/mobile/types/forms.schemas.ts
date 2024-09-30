import { z } from 'zod';

export const deviceOnBoardingFormSchema = z.object({
  serialNumber: z.string().min(1, 'Device Serial is required'),
  usage: z.string().min(1, 'Device Usage is required'),
  type: z.string().min(1, 'Device Type is required'),
  name: z.string().min(1, 'Device Name is required'),
  location: z.string().min(1, 'Device Location is required'),
  averageEnergyCost: z.number().positive('Average Energy Cost must be positive'),
  minOffTime: z.number().positive('Minimum Off-Time is required'),
  brownOutVoltageChange: z.number().positive('Brownout Voltage Change is required'),
  brownOutFrequencyChange: z.number().positive('Brownout Frequency Change is required'),
  utility: z.string().min(1, 'Utility is required'),
  country: z.string().min(1, 'Country is required'),
  meterServiceID: z.string().min(1, 'Meter Service ID is required'),
  isConnectedToPrimaryDevice: z.boolean(),
  utilitySmartPanel: z.string().min(1, 'Utility is required'),
  countrySmartPanel: z.string().min(1, 'Country is required'),
  meterServiceIDSmartPanel: z.string().min(1, 'Meter Service ID is required'),
  maxLoad: z.number().positive('Max Load is required'),
  identifier: z.string().min(1, 'Device Identifier is required'),
});

export type DeviceOnBoardingForm = z.infer<typeof deviceOnBoardingFormSchema>;
