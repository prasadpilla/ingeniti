import { useSignUp } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { Themes } from '../styles/themes';
import { Navigation } from '../types';

interface Props {
  navigation: Navigation;
}

const SignUpScreen = ({ navigation }: Props) => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [pendingVerification, setPendingVerification] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Background>
      {!pendingVerification ? (
        <>
          <Header>Create Account</Header>

          <TextInput
            label="First name"
            returnKeyType="next"
            value={firstName}
            onChangeText={(firstName) => setFirstName(firstName)}
            required
          />

          <TextInput
            label="Last name"
            returnKeyType="next"
            value={lastName}
            onChangeText={(lastName) => setLastName(lastName)}
            required
          />

          <TextInput
            label="Email"
            returnKeyType="next"
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            required
          />

          <View style={styles.inpuContainer}>
            <TextInput
              label="Code"
              returnKeyType="next"
              value={countryCode}
              onChangeText={setCountryCode}
              containerStyles={{ width: '20%' }}
              style={styles.countryCodeInput}
            />

            <TextInput
              label="Phone number"
              returnKeyType="next"
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

          <TextInput
            label="Password"
            returnKeyType="done"
            value={password}
            onChangeText={setPassword}
            isPassword
            required
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
        </>
      ) : (
        <>
          <Header>Verify Your Account</Header>

          <TextInput
            label="Vefication Code"
            returnKeyType="done"
            value={code}
            onChangeText={(code) => setCode(code)}
          />

          <Button mode="contained" onPress={onPressVerify} style={styles.button}>
            Verify
          </Button>
        </>
      )}
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
    marginVertical: 10,
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

export default SignUpScreen;
