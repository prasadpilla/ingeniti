import { z } from 'zod';

const DeviceDetailsSchema = z.object({
  deviceSerial: z.string().nonempty('Device Serial is required'),
  deviceUsage: z.enum(['Agriculture', 'Industrial', 'Commercial', 'Residential']),
  deviceType: z.enum(['Pump/Motor', 'Meter', 'Others']),
  deviceName: z.string().nonempty('Device Name is required'),
  deviceIdentifier: z.string().nonempty('Device Identifier is required'),
  deviceLocation: z.string().nonempty('Device Location is required'),
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

export { DeviceDetailsSchema, ProtectionSchema, UtilityBenefitsSchema, SmartPanelBenefitsSchema };
