import { useClerk } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { ActivityIndicator, Switch, useTheme } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import { DarkTheme, LightTheme } from '../styles/themes';

export default function SettingsScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { signOut } = useClerk();
  const { t } = useTranslation();

  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
      setTimeout(() => {
        setIsSigningOut(false);
      }, 0);
    } catch (error) {
      console.error(error);
      setIsSigningOut(false);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Background>
      <Header>{t('settings')}</Header>
      <Switch color={theme.colors.primary} value={false} onValueChange={() => {}} />
      <Button mode="contained" onPress={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? <ActivityIndicator animating={true} color={theme.colors.secondary} /> : t('sign_out')}
      </Button>
    </Background>
  );
}
