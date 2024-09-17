import { useSignUp } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerificationCodeForm, verificationCodeFormSchema } from '@ingeniti/shared';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { Themes } from '../styles/themes';
import { VerifySignUpEmailProps } from '../types';

const VerifySignUpEmailScreen: React.FC<VerifySignUpEmailProps> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isLoaded, signUp } = useSignUp();

  const { firstName, lastName, emailAddress, phoneNumber } = route.params;

  const verificationCodeForm = useForm<VerificationCodeForm>({
    resolver: zodResolver(verificationCodeFormSchema),
    defaultValues: {
      code: '',
    },
  });

  const [verificationError, setVerificationError] = useState<string | undefined>(undefined);

  const onPressVerify: SubmitHandler<VerificationCodeForm> = async (data) => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (completeSignUp.status === 'missing_requirements') {
        await signUp.preparePhoneNumberVerification({
          strategy: 'phone_code',
        });
        navigation.navigate('VerifySignUpPhone', {
          firstName,
          lastName,
          phoneNumber,
        });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: unknown) {
      handleVerificationErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
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
    <Background>
      <Header>{t('verify_your_phone')}</Header>

      <View>
        <Paragraph style={styles.paragraph}>{t('enter_email_verification_code')}</Paragraph>
        <View style={styles.credentialContainer}>
          <Paragraph style={styles.credential}>{emailAddress}</Paragraph>
        </View>
      </View>

      <Controller
        control={verificationCodeForm.control}
        name="code"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label={t('verify_otp')}
            returnKeyType="done"
            value={value}
            onChangeText={(text) => {
              onChange(text);
              if (verificationError) setVerificationError(undefined);
            }}
            onBlur={onBlur}
            errorText={error?.message}
          />
        )}
      />

      {verificationError && <Paragraph style={styles.errorText}>{verificationError}</Paragraph>}

      <Button
        mode="contained"
        onPress={verificationCodeForm.handleSubmit(onPressVerify)}
        style={styles.button}
        disabled={
          verificationCodeForm.formState.isSubmitting || !verificationCodeForm.formState.isValid
        }
      >
        {t('verify_otp')}
      </Button>

      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => {
          setVerificationError(undefined);
          verificationCodeForm.reset();
          navigation.goBack();
        }}
      >
        <Paragraph style={styles.goBackText}>{t('go_back')}</Paragraph>
      </TouchableOpacity>
    </Background>
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
  editIcon: {
    color: Themes.colors.secondary,
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
    color: Themes.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerifySignUpEmailScreen;
