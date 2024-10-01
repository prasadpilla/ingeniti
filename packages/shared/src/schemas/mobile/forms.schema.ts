import { z } from 'zod';

const PHONE_NUMBER_REGEX = /^(\+?\d{1,3})?[\s.-]?(\d{3,4})([\s.-]?(\d{3,}))$/;

const signUpFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required!'),
  lastName: z.string().min(1, 'Last name is required!'),
  emailAddress: z.string().min(1, 'Email is required!').email('Email is invalid!'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required!')
    .max(16, 'Invalid phone number!')
    .regex(PHONE_NUMBER_REGEX, 'Invalid phone number format!'),
  password: z
    .string()
    .min(8, 'Password must contain minimum 8 characters!')
    .max(30, 'Password cannot exceed 30 characters!'),
  termsAndConditions: z.boolean().refine((data) => data === true, {
    message: 'You must accept the terms and conditions!',
  }),
});

const loginFormEmailSchema = z.object({
  emailAddress: z.string().min(1, 'Email is required!').email('Email is invalid!'),
  password: z
    .string()
    .min(6, 'Password must contain minimum 6 characters!')
    .max(30, 'Password cannot exceed 30 characters!'),
});

const loginFormPhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required!')
    .max(16, 'Invalid phone number!')
    .regex(PHONE_NUMBER_REGEX, 'Invalid phone number format!'),
});

const verificationCodeFormSchema = z.object({
  code: z.string().length(6, 'OTP must be a 6-digit number!'),
});

const deviceOnBoardingFormSchema = z
  .object({
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
    utilitySmartPanel: z.string().optional(),
    countrySmartPanel: z.string().optional(),
    meterServiceIDSmartPanel: z.string().optional(),
    maxLoad: z.number().optional(),
    identifier: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isConnectedToPrimaryDevice) {
      if (!data.utilitySmartPanel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Utility is required',
          path: ['utilitySmartPanel'],
        });
      }
      if (!data.countrySmartPanel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Country is required',
          path: ['countrySmartPanel'],
        });
      }
      if (!data.meterServiceIDSmartPanel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Meter Service ID is required',
          path: ['meterServiceIDSmartPanel'],
        });
      }
      if (!data.maxLoad) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max Load is required',
          path: ['maxLoad'],
        });
      }
    } else {
      if (!data.identifier) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Identifier is required',
          path: ['identifier'],
        });
      }
    }
  });

export {
  signUpFormSchema,
  loginFormEmailSchema,
  loginFormPhoneSchema,
  verificationCodeFormSchema,
  deviceOnBoardingFormSchema,
};

export type SignUpForm = z.infer<typeof signUpFormSchema>;
export type LoginFormEmail = z.infer<typeof loginFormEmailSchema>;
export type LoginFormPhone = z.infer<typeof loginFormPhoneSchema>;
export type VerificationCodeForm = z.infer<typeof verificationCodeFormSchema>;
export type DeviceOnBoardingForm = z.infer<typeof deviceOnBoardingFormSchema>;
