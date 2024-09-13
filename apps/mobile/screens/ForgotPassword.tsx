import { useSignIn } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import Background from '../components/Background';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { Themes } from '../styles/themes';
import { ForgotPasswordProps } from '../types';

const forgotPasswordSchema = z.object({
  emailAddress: z.string().email('Invalid email address'),
});

const verifyOTPSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),
});

const newPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type VerifyOTPForm = z.infer<typeof verifyOTPSchema>;
type NewPasswordForm = z.infer<typeof newPasswordSchema>;

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const { signIn, isLoaded } = useSignIn();
  const [resetError, setResetError] = useState<string | undefined>();
  const [resetSent, setResetSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const forgotPasswordForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailAddress: '',
    },
  });

  const verifyOTPForm = useForm<VerifyOTPForm>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      otp: '',
    },
  });

  const newPasswordForm = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (otpVerified) {
      newPasswordForm.reset();
    }
  }, [otpVerified]);

  const onResetPress = async (data: ForgotPasswordForm) => {
    if (!isLoaded) return;

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: data.emailAddress,
      });
      setResetSent(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setResetError(err.errors[0]?.message || 'An error occurred');
    }
  };

  const onVerifyOTP = async (data: VerifyOTPForm) => {
    if (!isLoaded) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.otp,
      });

      if (result.status === 'needs_new_password') {
        setOtpVerified(true);
      } else {
        console.error('Unexpected result:', result);
        setResetError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setResetError(err.errors[0]?.message || 'An error occurred');
    }
  };

  const onNewPasswordSubmit = async (data: NewPasswordForm) => {
    if (!isLoaded) return;

    try {
      const result = await signIn.resetPassword({
        password: data.password,
      });

      if (result.status === 'complete') {
        setVerificationComplete(true);
        navigation.navigate('Home');
      } else {
        console.error('Unexpected result:', result);
        setResetError('Password reset failed. Please try again.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setResetError(err.errors[0]?.message || 'An error occurred');
    }
  };

  return (
    <Background>
      <Header>Reset Password</Header>
      {!resetSent ? (
        <>
          <Controller
            control={forgotPasswordForm.control}
            name="emailAddress"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label="Email"
                returnKeyType="done"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={error?.message || resetError}
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
              />
            )}
          />
          <Button mode="contained" onPress={forgotPasswordForm.handleSubmit(onResetPress)}>
            Send OTP
          </Button>
        </>
      ) : !otpVerified ? (
        <>
          <Text style={styles.centeredText}>
            OTP sent to your email. Please enter the OTP below.
          </Text>
          <Controller
            control={verifyOTPForm.control}
            name="otp"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label="OTP"
                returnKeyType="done"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={error?.message || resetError}
                keyboardType="number-pad"
              />
            )}
          />
          <Button mode="contained" onPress={verifyOTPForm.handleSubmit(onVerifyOTP)}>
            Verify OTP
          </Button>
        </>
      ) : !verificationComplete ? (
        <View style={styles.fullWidth}>
          <Text style={[styles.centeredText, styles.marginBottom]}>
            OTP verified. Please enter your new password.
          </Text>
          <Controller
            control={newPasswordForm.control}
            name="password"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label="New Password"
                returnKeyType="next"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={error?.message}
                secureTextEntry
              />
            )}
          />
          <Controller
            control={newPasswordForm.control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label="Confirm New Password"
                returnKeyType="done"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={error?.message}
                secureTextEntry
              />
            )}
          />
          <Button mode="contained" onPress={newPasswordForm.handleSubmit(onNewPasswordSubmit)}>
            Reset Password
          </Button>
        </View>
      ) : (
        <Text style={styles.centeredText}>
          Password reset successful. You can now log in with your new password.
        </Text>
      )}
      {resetError && <Text style={styles.errorText}>{resetError}</Text>}
      <View style={styles.backToLoginContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  centeredText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  backToLoginText: {
    color: Themes.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 16,
  },
});

export default ForgotPasswordScreen;
