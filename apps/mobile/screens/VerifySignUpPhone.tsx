import { useSignUp } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerificationCodeForm, verificationCodeFormSchema } from '@ingeniti/shared';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { VerifySignUpPhoneProps } from '../types';

const VerifySignUpPhoneScreen: React.FC<VerifySignUpPhoneProps> = ({ route }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { phoneNumber, firstName, lastName } = route.params;
  const navigation = useNavigation();

  const [verificationError, setVerificationError] = useState<string | undefined>(undefined);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const verificationCodeForm = useForm<VerificationCodeForm>({
    resolver: zodResolver(verificationCodeFormSchema),
    defaultValues: {
      code: '',
    },
  });

  const onPressVerify: SubmitHandler<VerificationCodeForm> = async (data) => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptPhoneNumberVerification({
        code: data.code,
      });

      if (completeSignUp.status !== 'complete') {
        console.error(JSON.stringify(completeSignUp, null, 2));
        return;
      }

      console.log('completeSignUp', completeSignUp);

      await setActive({ session: completeSignUp.createdSessionId });
      // await signUp.update({ firstName, lastName });
    } catch (err: any) {
      handleVerificationErrors(err.errors);
      console.error('Error during verification:', err.message || err);
    }
  };

  const handleVerificationErrors = (errors: ClerkAPIError[]) => {
    if (errors.length > 0) {
      const err = errors[0];
      const errCode = err.code;
      const paramName = err.meta?.paramName;

      if (`${errCode}-${paramName}` === 'form_code_incorrect-code') {
        setVerificationError(t('otp_incorrect'));
      } else {
        setVerificationError(t('something_went_wrong'));
      }
    }
  };

  const onResendOTP = async () => {
    if (!isLoaded || cooldown > 0) return;

    setResendLoading(true);
    try {
      await signUp.preparePhoneNumberVerification({
        strategy: 'phone_code',
      });
      setCooldown(30); 
    } catch (err: unknown) {
      handleVerificationErrors(err.errors);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Background>
      <Header>{t('verify_your_phone')}</Header>

      <View>
        <Paragraph style={styles.paragraph}>{t('enter_phone_verification_code')}</Paragraph>
        <View style={styles.credentialContainer}>
          <Paragraph style={styles.credential}>{phoneNumber}</Paragraph>
        </View>
      </View>

      <Controller
        control={verificationCodeForm.control}
        name="code"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label={t('verification_code')}
            returnKeyType="done"
            value={value}
            onChangeText={(text) => {
              onChange(text);
              if (verificationError) setVerificationError(undefined);
            }}
            onBlur={onBlur}
            errorText={error?.message}
            keyboardType="number-pad"
          />
        )}
      />

      <View style={styles.resendButton}>
        <Paragraph style={styles.paragraph}>{t('Did not receive the code yet?')}</Paragraph>
        <TouchableOpacity onPress={onResendOTP} disabled={resendLoading || cooldown > 0}>
          {resendLoading ? (
            <ActivityIndicator animating={true} color={theme.colors.secondary} />
          ) : (
            <Paragraph
              style={[styles.resendText, cooldown > 0 ? styles.cooldownText : { color: theme.colors.primary }]}
            >
              {cooldown > 0 ? `${t('Resend otp')} (${cooldown}s)` : t('Resend')}
            </Paragraph>
          )}
        </TouchableOpacity>
      </View>

      {verificationError && (
        <Paragraph style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>{verificationError}</Paragraph>
      )}

      <Button
        mode="contained"
        onPress={verificationCodeForm.handleSubmit(onPressVerify)}
        style={styles.button}
        disabled={verificationCodeForm.formState.isSubmitting || !verificationCodeForm.formState.isValid}
      >
        {verificationCodeForm.formState.isSubmitting ? (
          <ActivityIndicator animating={true} color={theme.colors.secondary} />
        ) : (
          t('verify')
        )}
      </Button>

      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => {
          setVerificationError(undefined);
          verificationCodeForm.reset();
          navigation.goBack();
        }}
      >
        <Paragraph style={[styles.goBackText, { color: theme.colors.primary }]}>{t('go_back')}</Paragraph>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 14,
  },
  credentialContainer: {
    marginTop: -4,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderRadius: 50,
  },
  credential: {
    fontSize: 14,
  },
  button: {
    marginTop: 24,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  goBackButton: {
    marginTop: 24,
    alignSelf: 'center',
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    position: 'relative',
    right: 0,
    bottom: 0,
    alignSelf: 'flex-start',
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cooldownText: {
    color: 'gray',
  },
});

export default VerifySignUpPhoneScreen;
