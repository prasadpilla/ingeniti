import { z } from 'zod';

const deviceDetailsFormSchema = z.object({
  deviceSerial: z.string().min(1, 'Device Serial is required'),
  deviceUsage: z.string().min(1, 'Device Usage is required'),
  deviceType: z.string().min(1, 'Device Type is required'),
  deviceName: z.string().min(1, 'Device Name is required'),
  deviceLocation: z.string().min(1, 'Device Location is required'),
  averageEnergyCost: z.number().positive('Average Energy Cost must be positive'),
});

export const deviceOnBoardingFormSchema = z.object({
  serialNumber: z.string().min(1, 'Device Serial is required'),
  usage: z.string().min(1, 'Device Usage is required'),
  type: z.string().min(1, 'Device Type is required'),
  name: z.string().min(1, 'Device Name is required'),
  location: z.string().min(1, 'Device Location is required'),
  averageEnergyCost: z.number().positive('Average Energy Cost must be positive'),
  minOffTime: z.string().min(1, 'Minimum Off-Time is required'),
  brownOutVoltageChange: z.string().min(1, 'Brownout Voltage Change is required'),
  brownOutFrequencyChange: z.string().min(1, 'Brownout Frequency Change is required'),
  enrollmentStatus: z.enum(['Enrolled', 'Not Enrolled']),
  utility: z.string().min(1, 'Utility is required'),
  country: z.string().min(1, 'Country is required'),
  meterServiceID: z.string().min(1, 'Meter Service ID is required'),
  isConnectedToPrimaryDevice: z.enum(['Yes', 'No']),
  utilitySmartPanel: z.string().min(1, 'Utility is required'),
  countrySmartPanel: z.string().min(1, 'Country is required'),
  meterServiceIDSmartPanel: z.string().min(1, 'Meter Service ID is required'),
  maxLoad: z.number().min(1, 'Max Load is required'),
  identifier: z.string().min(1, 'Device Identifier is required'),
});

export type DeviceDetailsForm = z.infer<typeof deviceDetailsFormSchema>;
export type DeviceOnBoardingForm = z.infer<typeof deviceOnBoardingFormSchema>;
