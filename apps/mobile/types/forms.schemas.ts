import { z } from 'zod';

const deviceDetailsFormSchema = z.object({
  deviceSerial: z.string().min(1, 'Device Serial is required'),
  deviceUsage: z.string().min(1, 'Device Usage is required'),
  deviceType: z.string().min(1, 'Device Type is required'),
  deviceName: z.string().min(1, 'Device Name is required'),
  deviceLocation: z.string().min(1, 'Device Location is required'),
  averageEnergyCost: z.number().positive('Average Energy Cost must be positive'),
});

const deviceProtectionFormSchema = z.object({
  minOffTime: z.string().min(1),
  brownOutVoltageChange: z.string().min(1),
  brownOutFrequencyChange: z.string().min(1),
});

const benefitsUtilityFormSchema = z.object({
  enrollmentStatus: z.enum(['Enrolled', 'Not Enrolled']),
  utility: z.string().min(1, 'Utility is required'),
  country: z.string().min(1, 'Country is required'),
  meterServiceID: z.string().min(1, 'Meter Service ID is required'),
});

const benefitsUtilityForConnectedDeviceFormSchema = z.object({
  isConnectedToPrimaryDevice: z.enum(['Connected', 'No']),
  utility: z.string().min(1, 'Utility is required'),
  country: z.string().min(1, 'Country is required'),
  meterServiceID: z.string().min(1, 'Meter Service ID is required'),
  maxLoad: z.number().min(1, 'Max Load is required'),
});

const benefitsUtilityForNoDeviceFormSchema = z.object({
  isConnectedToPrimaryDevice: z.enum(['Connected', 'No']),
  deviceIdentifier: z.string().min(1, 'Device Identifier is required'),
});

export const deviceOnBoardingFormSchema = z.object({
  deviceDetails: deviceDetailsFormSchema,
  deviceProtection: deviceProtectionFormSchema,
  benefitsUtility: benefitsUtilityFormSchema,
  benefitsUtilitySmartPanel: z.object({
    connectedDevice: benefitsUtilityForConnectedDeviceFormSchema,
    noDevice: benefitsUtilityForNoDeviceFormSchema,
  }),
});

export type DeviceDetailsForm = z.infer<typeof deviceDetailsFormSchema>;
export type DeviceOnBoardingForm = z.infer<typeof deviceOnBoardingFormSchema>;
