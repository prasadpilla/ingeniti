import { useSignIn } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Appbar, useTheme } from 'react-native-paper';
import { VerificationCodeForm, verificationCodeFormSchema } from 'shared';

import Background from '../components/Background';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { VerifyLoginPhoneProps } from '../types';

const VerifyLoginPhoneScreen: React.FC<VerifyLoginPhoneProps> = ({ route }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { phoneNumber } = route.params;
  const navigation = useNavigation();

  const verificationCodeForm = useForm<VerificationCodeForm>({
    resolver: zodResolver(verificationCodeFormSchema),
    defaultValues: {
      code: '',
    },
  });

  const [verificationError, setVerificationError] = useState<string | undefined>(undefined);

  const onPressVerify: SubmitHandler<VerificationCodeForm> = async (data) => {
    if (!isLoaded && !signIn) {
      return;
    }

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: 'phone_code',
        code: data.code,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        setVerificationError(t('something_went_wrong'));
      }
    } catch (err: unknown) {
      console.error('Error:', JSON.stringify(err, null, 2));
      handleVerificationErrors(err.errors);
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

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.secondaryContainer,
          height: 60,
          zIndex: 100,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.goBack()}>
          <Appbar.BackAction size={24} />
        </TouchableOpacity>
        <Appbar.Content title={t('verify_your_phone')} titleStyle={styles.headerTitle} />
        <View style={{ width: 40 }} />
      </Appbar.Header>
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
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={error?.message}
            />
          )}
        />
        {verificationError && (
          <Paragraph style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
            {verificationError}
          </Paragraph>
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
    </>
  );
};

const styles = StyleSheet.create({
  paragraph: { fontSize: 14 },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default VerifyLoginPhoneScreen;
