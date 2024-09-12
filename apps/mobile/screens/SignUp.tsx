import { useSignUp } from '@clerk/clerk-expo';
import React, { useState } from 'react';
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
      <FormInput
        label="First name"
        returnKeyType="next"
        value={firstName}
        onChangeText={(firstName) => setFirstName(firstName)}
        required
      />
      <FormInput
        label="Last name"
        returnKeyType="next"
        value={lastName}
        onChangeText={(lastName) => setLastName(lastName)}
        required
      />
      <FormInput
        label="Email"
        returnKeyType="next"
        value={emailAddress}
        onChangeText={(email) => setEmailAddress(email)}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <View style={styles.inpuContainer}>
        <FormInput
          label="Code"
          returnKeyType="next"
          value={countryCode}
          onChangeText={setCountryCode}
          containerStyles={{ width: '20%' }}
          style={styles.countryCodeInput}
        />
        <FormInput
          label="Phone number"
          returnKeyType="done"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          containerStyles={{ flex: 1 }}
          style={styles.phoneNumberInput}
          keyboardType="number-pad"
          selectionColor={Themes.colors.primary}
          underlineColor="transparent"
          mode="outlined"
        />
      </View>
      <FormInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={(password) => setPassword(password)}
        isPassword
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
