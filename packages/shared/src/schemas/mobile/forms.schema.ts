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

export { signUpFormSchema, loginFormEmailSchema, loginFormPhoneSchema, verificationCodeFormSchema };

export type SignUpForm = z.infer<typeof signUpFormSchema>;
export type LoginFormEmail = z.infer<typeof loginFormEmailSchema>;
export type LoginFormPhone = z.infer<typeof loginFormPhoneSchema>;
export type VerificationCodeForm = z.infer<typeof verificationCodeFormSchema>;
