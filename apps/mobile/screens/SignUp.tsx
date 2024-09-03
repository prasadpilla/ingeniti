import { useSignUp } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { Themes } from '../styles/themes';

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const { isLoaded, signUp } = useSignUp();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('91');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usePhone, setUsePhone] = useState(true);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    const phone = `+${countryCode}${phoneNumber.replace(/\D/g, '')}`;

    try {
      if (usePhone && phoneNumber) {
        console.log('phone nunber', phone, typeof phone);
        await signUp.create({
          firstName,
          lastName,
          phoneNumber: phone,
        });

        await signUp.preparePhoneNumberVerification();
      } else if (!usePhone && emailAddress) {
        await signUp.create({
          firstName,
          lastName,
          emailAddress,
          password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
      }

      navigation.navigate('Verify', {
        usePhone,
        phoneNumber: usePhone ? phone : undefined,
        emailAddress: !usePhone ? emailAddress : undefined,
      });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Background>
      <Header>Create Account</Header>
      <View style={styles.usePhone}>
        <TouchableOpacity onPress={() => setUsePhone(!usePhone)}>
          <Text style={styles.usePhoneLabel}>{!usePhone ? 'Use Phone' : 'Use email'}</Text>
        </TouchableOpacity>
      </View>
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
  usePhone: { width: '100%', alignItems: 'flex-end', marginBottom: -8, zIndex: 10 },
  usePhoneLabel: {
    color: Themes.colors.primary,
    fontWeight: '500',
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
