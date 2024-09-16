import { useSignUp } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpForm, signUpFormSchema } from '@ingeniti/shared';
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
import { SignupProps } from '../types';
import { countries, CountryData } from '../utils/country-data';

const SignUpScreen: React.FC<SignupProps> = ({ navigation }) => {
  const { isLoaded, signUp } = useSignUp();
  const [signUpError, setSignUpError] = useState<string | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0]);

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const handleSignUpErrors = (errors: ClerkAPIError[]) => {
    if (errors.length > 0) {
      const err = errors[0];
      const errCode = err.code;
      const paramName = err.meta?.paramName;

      switch (`${errCode}-${paramName}`) {
        case 'form_identifier_exists-email_address':
          setSignUpError(err.longMessage);
          break;
        case 'form_identifier_exists-phone_number':
          setSignUpError(err.longMessage);
          break;
        case 'form_param_format_invalid-phone_number':
          setSignUpError('Invalid phone number!');
          break;
        case 'form_password_pwned-password':
          setSignUpError('Password is too common. Please choose a stronger password.');
          break;
        default:
          setSignUpError('Something went wrong. Try again');
          break;
      }
    }
  };

  const onSignUpPress: SubmitHandler<SignUpForm> = async (data) => {
    if (!isLoaded) return;

    const { firstName, lastName, emailAddress, password } = data;
    const phone = `${selectedCountry.code}${data.phoneNumber}`;
    try {
      await signUp.create({
        emailAddress,
        phoneNumber: phone,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      navigation.navigate('VerifySignUpEmail', {
        emailAddress,
        phoneNumber: phone,
        firstName,
        lastName,
      });
    } catch (err: any) {
      handleSignUpErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Background>
      <Header>Create Account</Header>
      <Controller
        control={signUpForm.control}
        name="firstName"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label="First name"
            returnKeyType="next"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorText={error?.message}
          />
        )}
      />

      <Controller
        control={signUpForm.control}
        name="lastName"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label="Last name"
            returnKeyType="next"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorText={error?.message}
          />
        )}
      />

      <Controller
        control={signUpForm.control}
        name="emailAddress"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label="Email"
            returnKeyType="next"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              if (signUpError) setSignUpError(undefined);
            }}
            errorText={error?.message}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
        )}
      />

      <View style={styles.phoneInputContainer}>
        <View style={styles.phoneInput}>
          <CountryCodePicker
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
          <Controller
            control={signUpForm.control}
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
                  if (signUpError) setSignUpError(undefined);
                }}
                onBlur={onBlur}
                hasError={!!error?.message}
                keyboardType="phone-pad"
                selectionColor={Themes.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                containerStyles={styles.phoneInputField}
              />
            )}
          />
        </View>

        {signUpForm.formState.errors.phoneNumber && (
          <Paragraph style={styles.phoneInputFieldError}>
            {signUpForm.formState.errors.phoneNumber.message}
          </Paragraph>
        )}
      </View>

      <Controller
        control={signUpForm.control}
        name="password"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label="Password"
            returnKeyType="done"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              if (signUpError) setSignUpError(undefined);
            }}
            errorText={error?.message}
            isPassword
          />
        )}
      />

      {signUpError && <Paragraph style={styles.errorText}>{signUpError}</Paragraph>}

      <Button
        mode="contained"
        onPress={signUpForm.handleSubmit(onSignUpPress)}
        style={styles.button}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Paragraph style={styles.label}>Already have an account? </Paragraph>
        <TouchableOpacity
          onPress={() => {
            signUpForm.reset();
            navigation.navigate('Login');
          }}
        >
          <Paragraph style={styles.link}>Login</Paragraph>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Paragraph style={styles.goBackText}>Go Back</Paragraph>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Themes.colors.primary,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Themes.colors.surface,
  },
  countryCodeInput: {
    backgroundColor: '#eee',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  goBackButton: {
    marginTop: 24,
  },
  goBackText: {
    color: Themes.colors.primary,
    fontWeight: '600',
  },
  phoneInputContainer: {
    width: '100%',
  },
  phoneInput: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneInputField: {
    flex: 1,
  },
  phoneInputFieldError: {
    color: 'red',
    textAlign: 'left',
    fontSize: 12,
    marginTop: -8,
    marginLeft: 4,
  },
});

export default SignUpScreen;
