import { z } from 'zod';

const REQUIRED_ERROR = 'This field is required!';
const COUNTRY_CODE_REGEX = /^\+?[1-9]\d{1,3}$/;
const PHONE_NUMBER_REGEX = /^\d{7,14}$/;

const signUpForm = z.object({
  firstName: z.string({
    invalid_type_error: 'First name must be a string!',
    required_error: REQUIRED_ERROR,
  }),
  lastName: z.string({
    invalid_type_error: 'Last name must be a string!',
    required_error: REQUIRED_ERROR,
  }),
  emailAddress: z
    .string({
      invalid_type_error: 'Email must be a string!',
      required_error: REQUIRED_ERROR,
    })
    .email('Email is invalid!'),
  countryCode: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .regex(COUNTRY_CODE_REGEX, 'Invalid country code!'),
  phoneNumber: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .regex(PHONE_NUMBER_REGEX, 'Invalid phone number!'),
  password: z
    .string({
      required_error: REQUIRED_ERROR,
    })
    .min(6, 'Password must contain minimum 6 characters!')
    .max(30, 'Password cannot exceed 30 characters!'),
});

export { signUpForm };

export type SignUpForm = z.infer<typeof signUpForm>;
