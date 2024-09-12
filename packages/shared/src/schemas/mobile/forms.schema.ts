import { z } from 'zod';

const PHONE_NUMBER_REGEX = /^(\+?\d{1,3})?[\s.-]?(\d{3,4})([\s.-]?(\d{3,}))$/;

const signUpFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required!'),
  lastName: z.string().min(1, 'Last name is required!'),
  emailAddress: z.string().min(1, 'Email is required!').email('Email is invalid!'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required!')
    .regex(PHONE_NUMBER_REGEX, 'Invalid phone number format!'),
  password: z
    .string()
    .min(6, 'Password must contain minimum 6 characters!')
    .max(30, 'Password cannot exceed 30 characters!'),
});

export { signUpFormSchema };

export type SignUpForm = z.infer<typeof signUpFormSchema>;
