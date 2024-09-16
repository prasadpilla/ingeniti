import { useSignIn } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerificationCodeForm, verificationCodeFormSchema } from '@ingeniti/shared';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { Themes } from '../styles/themes';
import { VerifyLoginPhoneProps } from '../types';

const VerifyLoginPhoneScreen: React.FC<VerifyLoginPhoneProps> = ({ route }) => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { phoneNumber } = route.params;

  const verificationCodeForm = useForm<VerificationCodeForm>({
    resolver: zodResolver(verificationCodeFormSchema),
    defaultValues: {
      code: '',
    },
  });

  const [verificationError, setVerificationError] = useState<string | undefined>(undefined); // Add state for error

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
        setVerificationError('Something went wrong. Please try again.');
      }
    } catch (err: any) {
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
        setVerificationError('The code is incorrect. Please try again.');
      } else {
        setVerificationError('Something went wrong. Try again');
      }
    }
  };

  return (
    <Background>
      <Header>Verify Your Phone</Header>
      <View>
        <Paragraph style={styles.paragraph}>Enter the code sent to your phone number</Paragraph>
        <View style={styles.credentialContainer}>
          <Paragraph style={styles.credential}>{phoneNumber}</Paragraph>
        </View>
      </View>
      <Controller
        control={verificationCodeForm.control}
        name="code"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label="Verification Code"
            returnKeyType="done"
            value={value}
            onChangeText={onChange}
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
      >
        Verify
      </Button>
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
});

export default VerifyLoginPhoneScreen;
