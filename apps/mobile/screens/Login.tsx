import { useSignIn } from '@clerk/clerk-expo';
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

const LoginScreen = ({ navigation }: Props) => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [usePhone, setUsePhone] = useState(false);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <Background>
      <Header>Welcome back.</Header>

      <View style={styles.usePhone}>
        <TouchableOpacity onPress={() => setUsePhone(!usePhone)}>
          <Text style={styles.usePhoneLabel}>{!usePhone ? 'Use Phone' : 'Use email'}</Text>
        </TouchableOpacity>
      </View>

      {!usePhone ? (
        <>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={emailAddress}
            onChangeText={(email) => setEmailAddress(email)}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <TextInput
            label="Password"
            returnKeyType="done"
            value={password}
            onChangeText={(password) => setPassword(password)}
            isPassword
          />

          <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <Text style={styles.label}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
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
      )}

      <Button mode="contained" onPress={onSignInPress}>
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
