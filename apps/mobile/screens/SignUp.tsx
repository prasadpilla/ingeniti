import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { Themes } from '../styles/themes';
import { Navigation } from '../types';
import { useSignUp } from '@clerk/clerk-expo';

interface Props {
  navigation: Navigation;
}

const SignUpScreen = ({ navigation }: Props) => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
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
          />

          <TextInput
            label="Last name"
            returnKeyType="next"
            value={lastName}
            onChangeText={(lastName) => setLastName(lastName)}
          />

          <TextInput
            label="Email"
            returnKeyType="next"
            value={emailAddress}
            onChangeText={(email) => setEmailAddress(email)}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <TextInput
            label="Password"
            returnKeyType="done"
            value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry
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
});

export default SignUpScreen;
