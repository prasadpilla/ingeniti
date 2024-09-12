import { useSignUp } from '@clerk/clerk-expo';
import { signUpFormSchema, SignUpForm } from '@ingeniti/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { Themes } from '../styles/themes';
import { SignupProps } from '../types';

const SignUpScreen: React.FC<SignupProps> = ({ navigation }) => {
  const { isLoaded, signUp } = useSignUp();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      countryCode: '+91',
      phoneNumber: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        phoneNumber: `${countryCode}${phoneNumber}`,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      navigation.navigate('VerifySignUpEmail', { emailAddress, phoneNumber, countryCode });
    } catch (err: any) {
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
            required
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
            onBlur={onBlur}
            onChangeText={onChange}
            required
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
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
        )}
      />

      {/* <Controller
        control={signUpForm.control}
        name="lastName"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
         
        )}
      /> */}
      <View style={styles.inpuContainer}>
        <Controller
          control={signUpForm.control}
          name="countryCode"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <FormInput
              label="Code"
              returnKeyType="next"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              containerStyles={{ width: '20%' }}
              style={styles.countryCodeInput}
            />
          )}
        />

        <Controller
          control={signUpForm.control}
          name="phoneNumber"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <FormInput
              label="Phone number"
              returnKeyType="done"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              containerStyles={{ flex: 1 }}
              style={styles.phoneNumberInput}
              keyboardType="number-pad"
              selectionColor={Themes.colors.primary}
              underlineColor="transparent"
              mode="outlined"
            />
          )}
        />
      </View>

      <Controller
        control={signUpForm.control}
        name="lastName"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <FormInput
            label="Password"
            returnKeyType="done"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            isPassword
          />
        )}
      />

      <Button mode="contained" onPress={onSignUpPress} style={styles.button}>
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
