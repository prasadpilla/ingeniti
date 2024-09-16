import { useSignIn } from '@clerk/clerk-expo';
import { ClerkAPIError, PhoneCodeFactor, SignInFirstFactor } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoginFormEmail,
  loginFormEmailSchema,
  LoginFormPhone,
  loginFormPhoneSchema,
} from '@ingeniti/shared';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import CountryCodePicker from '../components/CountryCodePicker';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { Themes } from '../styles/themes';
import { LoginProps } from '../types';
import { countries, CountryData } from '../utils/country-data';

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [usePhone, setUsePhone] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0]);

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

  const handleLoginErrors = (errors: ClerkAPIError[]) => {
    if (errors.length > 0) {
      const err = errors[0];
      const paramName = err.meta?.paramName;
      const errCode = err.code;

      switch (`${errCode}-${paramName}`) {
        case 'form_identifier_not_found-identifier':
          setLoginError(err.longMessage);
          break;
        case 'form_password_incorrect-password':
          setLoginError(`Password is incorrect. Please try again.`);
          break;
        case 'form_param_format_invalid-identifier':
          setLoginError('Invalid phone number!');
          break;
        default:
          setLoginError('Something went wrong. Please try again.');
      }
    }
  };

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
      handleLoginErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPhoneSignInPress: SubmitHandler<LoginFormPhone> = async (data) => {
    if (!isLoaded) {
      return;
    }

    const { phoneNumber } = data;
    const phone = `${selectedCountry.code}${phoneNumber}`;

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
      handleLoginErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Background>
      <Header>Welcome back</Header>

      <View style={styles.usePhoneContainer}>
        <TouchableOpacity
          onPress={() => {
            loginEmailForm.reset();
            loginPhoneForm.reset();
            setLoginError(undefined);
            setUsePhone(!usePhone);
          }}
        >
          <Paragraph style={styles.usePhoneText}>{!usePhone ? 'Use Phone' : 'Use email'}</Paragraph>
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
                onChangeText={(text) => {
                  onChange(text);
                  if (loginError) setLoginError(undefined);
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

          <Controller
            control={loginEmailForm.control}
            name="password"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label="Password"
                returnKeyType="done"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (loginError) setLoginError(undefined);
                }}
                onBlur={onBlur}
                errorText={error?.message}
                isPassword
              />
            )}
          />

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Paragraph style={styles.secondaryText}>Forgot your password?</Paragraph>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.phoneInputContainer}>
          <CountryCodePicker
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
          <Controller
            control={loginPhoneForm.control}
            name="phoneNumber"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <FormInput
                label="Phone number"
                placeholder="82345 54389"
                placeholderTextColor="#aaa"
                returnKeyType="done"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (loginError) setLoginError(undefined);
                }}
                onBlur={onBlur}
                errorText={error?.message}
                keyboardType="phone-pad"
                selectionColor={Themes.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                containerStyles={styles.phoneInput}
              />
            )}
          />
        </View>
      )}

      {loginError && <Paragraph style={styles.errorText}>{loginError}</Paragraph>}

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

      <View style={styles.signUpContainer}>
        <Paragraph style={styles.secondaryText}>Don't have an account? </Paragraph>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Paragraph style={styles.primaryText}>Sign up</Paragraph>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Paragraph style={styles.goBackText}>Go Back</Paragraph>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  usePhoneContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: -8,
    zIndex: 10,
  },
  usePhoneText: {
    color: Themes.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  secondaryText: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  primaryText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Themes.colors.primary,
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
  phoneInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    // backgroundColor: 'red',
  },
  phoneInput: {
    flex: 1,
  },
});

export default LoginScreen;
