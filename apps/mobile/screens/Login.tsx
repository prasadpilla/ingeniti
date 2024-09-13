import { useSignIn } from '@clerk/clerk-expo';
import { PhoneCodeFactor, SignInFirstFactor } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoginFormEmail,
  loginFormEmailSchema,
  LoginFormPhone,
  loginFormPhoneSchema,
} from '@ingeniti/shared';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { Themes } from '../styles/themes';
import { LoginProps } from '../types';

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [usePhone, setUsePhone] = useState(false);

  const loginEmailForm = useForm<LoginFormEmail>({
    resolver: zodResolver(loginFormEmailSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
    },
  });

  const loginPhoneForm = useForm<LoginFormPhone>({
    resolver: zodResolver(loginFormPhoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const onEmailSignInPress: SubmitHandler<LoginFormEmail> = async (data) => {
    if (!isLoaded) {
      return;
    }

    const { emailAddress, password } = data;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPhoneSignInPress: SubmitHandler<LoginFormPhone> = async (data) => {
    if (!isLoaded) {
      return;
    }

    const { phoneNumber } = data;
    const phone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: phone,
      });

      const isPhoneCodeFactor = (factor: SignInFirstFactor): factor is PhoneCodeFactor => {
        return factor.strategy === 'phone_code';
      };
      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (phoneCodeFactor) {
        const { phoneNumberId } = phoneCodeFactor;
        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId,
        });
      }

      navigation.navigate('VerifyLoginPhone', { phoneNumber: phone });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Background>
      <Header>Welcome back.</Header>

      <View style={styles.usePhone}>
        <TouchableOpacity
          onPress={() => {
            loginEmailForm.reset();
            loginPhoneForm.reset();
            setUsePhone(!usePhone);
          }}
        >
          <Text style={styles.usePhoneLabel}>{!usePhone ? 'Use Phone' : 'Use email'}</Text>
        </TouchableOpacity>
      </View>

      {!usePhone ? (
        <>
          <Controller
            control={loginEmailForm.control}
            name="emailAddress"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label="Email"
                returnKeyType="next"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={error?.message}
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
              />
            )}
          />

          <Controller
            control={loginEmailForm.control}
            name="password"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label="Password"
                returnKeyType="done"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={error?.message}
                isPassword
              />
            )}
          />

          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => {
                // TODO: Create Forgot password screen, Add to RootStack list
                // navigation.navigate('ForgotPasswordScreen');
              }}
            >
              <Text style={styles.label}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Controller
          control={loginPhoneForm.control}
          name="phoneNumber"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <FormInput
              label="Phone number"
              placeholder="+91 82345 54389"
              placeholderTextColor="#aaa"
              returnKeyType="done"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={error?.message}
              keyboardType="phone-pad"
              selectionColor={Themes.colors.primary}
              underlineColor="transparent"
              mode="outlined"
            />
          )}
        />
      )}

      <Button
        mode="contained"
        onPress={
          !usePhone
            ? loginEmailForm.handleSubmit(onEmailSignInPress)
            : loginPhoneForm.handleSubmit(onPhoneSignInPress)
        }
      >
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  usePhone: { width: '100%', alignItems: 'flex-end', marginBottom: -8, zIndex: 10 },
  usePhoneLabel: {
    color: Themes.colors.primary,
    fontWeight: '500',
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: Themes.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: Themes.colors.primary,
  },
  inpuContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Themes.colors.surface,
    padding: 0,
    marginBottom: 10,
  },
  countryCodeInput: {
    marginVertical: 0,
    backgroundColor: '#eee',
  },
  phoneNumberInput: {
    flex: 1,
    marginVertical: 0,
  },
});

export default LoginScreen;
