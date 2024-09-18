import { useAuth, useSignIn } from '@clerk/clerk-expo';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { z } from 'zod';

import Background from '../components/Background';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { Themes } from '../styles/themes';
import { ForgotPasswordProps } from '../types';

const forgotPasswordSchema = z.object({
  emailAddress: z.string().min(1, 'Email is required').email('Invalid email address'),
});

const verifyOTPSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
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
  const { t } = useTranslation();
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useAuth();
  const [resetError, setResetError] = useState<string | undefined>();
  const [resetSent, setResetSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const forgotPasswordForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailAddress: '',
    },
    mode: 'onBlur',
  });

  const verifyOTPForm = useForm<VerifyOTPForm>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      otp: '',
    },
    mode: 'onBlur',
  });

  const newPasswordForm = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
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
      setResetError(err.errors[0]?.longMessage || 'An error occurred');
    }
  };

  const onVerifyOTP = async (data: VerifyOTPForm) => {
    if (!isLoaded) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.otp,
      });

      console.log('After first factor', result);
      if (result.status === 'needs_new_password') {
        setOtpVerified(true);
      } else {
        console.error('Unexpected result:', result);
        setResetError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      if (err.errors[0]?.code === 'form_code_incorrect' && err.errors[0]?.meta.paramName === 'code') {
        setResetError('Invalid OTP. Please try again.');
      } else {
        setResetError('Something went wrong. Please try again.');
      }
    }
  };

  const onNewPasswordSubmit = async (data: NewPasswordForm) => {
    if (!isLoaded) return;

    try {
      const result = await signIn.resetPassword({
        password: data.password,
      });

      console.log('After reset password', result);
      if (result.status === 'complete') {
        setVerificationComplete(true);
        await signOut();
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
      <Header>{t('reset_password')}</Header>
      {!resetSent ? (
        <>
          <Controller
            control={forgotPasswordForm.control}
            name="emailAddress"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label={t('email')}
                returnKeyType="done"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (resetError) setResetError(undefined);
                }}
                onBlur={onBlur}
                errorText={error?.message}
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
              />
            )}
          />
          {resetError && <Text style={styles.errorText}>{resetError}</Text>}
          <Button
            mode="contained"
            onPress={forgotPasswordForm.handleSubmit(onResetPress)}
            disabled={forgotPasswordForm.formState.isSubmitting || !forgotPasswordForm.formState.isValid}
          >
            {forgotPasswordForm.formState.isSubmitting ? (
              <ActivityIndicator animating={true} color={Themes.colors.secondary} />
            ) : (
              t('send_otp')
            )}
          </Button>
        </>
      ) : !otpVerified ? (
        <>
          <Text style={styles.centeredText}>{t('enter_email_verification_code')}</Text>
          <Controller
            control={verifyOTPForm.control}
            name="otp"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label="OTP"
                returnKeyType="done"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (resetError) setResetError(undefined);
                }}
                onBlur={onBlur}
                errorText={error?.message}
                keyboardType="number-pad"
              />
            )}
          />
          {resetError && <Text style={styles.errorText}>{resetError}</Text>}
          <Button
            mode="contained"
            onPress={verifyOTPForm.handleSubmit(onVerifyOTP)}
            disabled={verifyOTPForm.formState.isSubmitting || !verifyOTPForm.formState.isValid}
          >
            {verifyOTPForm.formState.isSubmitting ? (
              <ActivityIndicator animating={true} color={Themes.colors.secondary} />
            ) : (
              t('verify_otp')
            )}
          </Button>
        </>
      ) : !verificationComplete ? (
        <View style={styles.fullWidth}>
          <Text style={[styles.centeredText, styles.marginBottom]}>OTP verified. Please enter your new password.</Text>
          <Controller
            control={newPasswordForm.control}
            name="password"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label={t('new_password')}
                returnKeyType="next"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (resetError) setResetError(undefined);
                }}
                onBlur={onBlur}
                errorText={error?.message}
                isPassword
              />
            )}
          />
          <Controller
            control={newPasswordForm.control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label={t('confirm_new_password')}
                returnKeyType="done"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (resetError) setResetError(undefined);
                }}
                onBlur={onBlur}
                errorText={error?.message}
                isPassword
              />
            )}
          />
          {resetError && <Text style={styles.errorText}>{resetError}</Text>}
          <Button
            mode="contained"
            onPress={newPasswordForm.handleSubmit(onNewPasswordSubmit)}
            disabled={newPasswordForm.formState.isSubmitting || !newPasswordForm.formState.isValid}
          >
            {newPasswordForm.formState.isSubmitting ? (
              <ActivityIndicator animating={true} color={Themes.colors.secondary} />
            ) : (
              t('reset_password')
            )}
          </Button>
        </View>
      ) : (
        <View style={styles.successContainer}>
          <MaterialIcons name="check-circle" size={24} color="green" />
          <Paragraph>{t('password_reset_successful')}</Paragraph>
        </View>
      )}
      <View style={styles.backToLoginContainer}>
        <TouchableOpacity
          onPress={() => {
            forgotPasswordForm.reset();
            verifyOTPForm.reset();
            newPasswordForm.reset();
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.backToLoginText}>{t('login')}</Text>
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
    textAlign: 'center',
    marginVertical: 8,
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
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});

export default ForgotPasswordScreen;
