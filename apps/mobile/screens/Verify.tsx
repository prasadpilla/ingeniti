import { useSignUp } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import TextInput from '../components/TextInput';
import { Themes } from '../styles/themes';

interface VerifyScreenProps {
  route: any;
  navigation: any;
}

const VerifyScreen = ({ route, navigation }: VerifyScreenProps) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { usePhone, emailAddress, phoneNumber } = route.params;

  const [verificationCode, setVerificationCode] = useState<string>('');

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      let completeSignUp;
      if (usePhone && phoneNumber) {
        completeSignUp = await signUp.attemptPhoneNumberVerification({
          code: verificationCode,
        });
      } else if (!usePhone && emailAddress) {
        completeSignUp = await signUp.attemptEmailAddressVerification({
          code: verificationCode,
        });
      }

      if (completeSignUp && completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Background>
      <Header>Verify Your {usePhone ? 'Phone' : 'Email'}</Header>

      <View>
        <Paragraph style={styles.paragraph}>
          Enter the verification code sent to your {usePhone ? 'phone' : 'email'}
        </Paragraph>
        <View style={styles.credentialContainer}>
          <Paragraph style={styles.credential}>{usePhone ? phoneNumber : emailAddress}</Paragraph>
          <TouchableOpacity onPress={() => {}}>
            <MaterialCommunityIcons name="pencil" size={20} style={styles.editIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        label="Vefication Code"
        returnKeyType="done"
        value={verificationCode}
        onChangeText={(verificationCode) => setVerificationCode(verificationCode)}
      />

      <Button mode="contained" onPress={onPressVerify} style={styles.button}>
        Verify
      </Button>
    </Background>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 14,
    color: Themes.colors.secondary,
  },
  credentialContainer: {
    marginTop: -4,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderRadius: 50,
  },
  credential: {
    alignItems: 'center',
    color: Themes.colors.secondary,
  },
  editIcon: {
    color: Themes.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
});

export default VerifyScreen;
