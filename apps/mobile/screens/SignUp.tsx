import { useSignUp } from '@clerk/clerk-expo';
import { ClerkAPIErrorJSON, ClerkAPIError } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpFormSchema, SignUpForm } from '@ingeniti/shared';
import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { Themes } from '../styles/themes';
import { SignupProps } from '../types';

const SignUpScreen: React.FC<SignupProps> = ({ navigation }) => {
  const { isLoaded, signUp } = useSignUp();
  const [signUpError, setSignUpError] = useState<Record<string, string | undefined>>({
    emailError: undefined,
    phoneError: undefined,
    defaultError: undefined,
  });

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
      const paramName = err.meta?.paramName;

      switch (paramName) {
        case 'email_address':
          setSignUpError({
            emailError: err.message,
            phoneError: undefined,
            default: undefined,
          });
          break;
        case 'phone_number':
          setSignUpError({
            emailError: undefined,
            phoneError: err.message,
            default: undefined,
          });
          break;
        default:
          setSignUpError({
            emailError: undefined,
            phoneError: undefined,
            default: err.message,
          });
      }
    }
  };

  const onSignUpPress: SubmitHandler<SignUpForm> = async (data) => {
    if (!isLoaded) return;

    const { firstName, lastName, emailAddress, phoneNumber, password } = data;
    const phone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

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
            onChangeText={onChange}
            errorText={error?.message || signUpError.emailError}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
        )}
      />

      <Controller
        control={signUpForm.control}
        name="phoneNumber"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label="Phone number"
            placeholder="+91 82345 54389"
            placeholderTextColor="#aaa"
            returnKeyType="done"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            errorText={error?.message || signUpError.phoneError}
            keyboardType="phone-pad"
            selectionColor={Themes.colors.primary}
            underlineColor="transparent"
            mode="outlined"
          />
        )}
      />

      <Controller
        control={signUpForm.control}
        name="password"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label="Password"
            returnKeyType="done"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            errorText={error?.message}
            isPassword
          />
        )}
      />

      <Button
        mode="contained"
        onPress={signUpForm.handleSubmit(onSignUpPress)}
        style={styles.button}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            signUpForm.reset();
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: Themes.colors.secondary,
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
    color: Themes.colors.primary,
  },
  inpuContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Themes.colors.surface,
  },
  countryCodeInput: {
    backgroundColor: '#eee',
  },
  phoneNumberInput: {
    flex: 1,
  },
});

export default SignUpScreen;
