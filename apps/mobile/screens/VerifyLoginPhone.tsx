import { useSignIn } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerificationCodeForm, verificationCodeFormSchema } from '@ingeniti/shared';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
        console.error(signInAttempt);
      }
    } catch (err) {
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  };

  return (
    <Background>
      <Header>Verify Your Phone</Header>

      <View>
        <Paragraph style={styles.paragraph}>
          Enter the verification code sent to your phone number
        </Paragraph>
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
  paragraph: {
    fontSize: 14,
    color: Themes.colors.secondary,
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
    alignItems: 'center',
    color: Themes.colors.secondary,
  },
  editIcon: {
    color: Themes.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
});

export default VerifyLoginPhoneScreen;
