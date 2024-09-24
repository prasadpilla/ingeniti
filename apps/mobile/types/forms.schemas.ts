import { z } from 'zod';

const deviceDetailsFormSchema = z.object({
  deviceSerial: z.string().min(1, 'Device Serial is required'),
  deviceUsage: z.enum(['Select an option', 'Agriculture', 'Industrial', 'Commercial', 'Residential']),
  deviceType: z.enum(['Select an option', 'Pump/Motor', 'Meter', 'Others']),
  deviceName: z.string().min(1, 'Device Name is required'),
  deviceIdentifier: z.string().min(1, 'Device Identifier is required'),
  deviceLocation: z.string().min(1, 'Device Location is required'),
  averageEnergyCost: z.number().positive('Average Energy Cost must be positive'),
});

const ProtectionSchema = z.object({
  minimumOffTime: z.number().positive('Minimum Off-Time must be positive'),
  voltageChange: z.number().positive('Voltage change must be positive'),
  frequencyChange: z.number().positive('Frequency change must be positive'),
});

const UtilityBenefitsSchema = z.object({
  utilityCountry: z.string().nonempty('Country is required'),
  utilityName: z.string().nonempty('Utility Name is required'),
  meterServiceID: z.string().nonempty('Meter Service ID is required'),
});

const SmartPanelBenefitsSchema = z.object({
  isPrimaryDevice: z.boolean(),
  maxLoad: z.number().positive('Max Load must be positive').optional(),
  associatedDevice: z.string().optional(),
});

export { deviceDetailsFormSchema, ProtectionSchema, UtilityBenefitsSchema, SmartPanelBenefitsSchema };

export type DeviceDetailsForm = z.infer<typeof deviceDetailsFormSchema>;
