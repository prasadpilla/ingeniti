import { useClerk } from '@clerk/clerk-expo';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';

export default function SettingsScreen() {
  const { signOut } = useClerk();
  const { t } = useTranslation();

  return (
    <Background>
      <Header>{t('settings')}</Header>
      <Switch color="red" value={false} onValueChange={() => {}} />
      <Button mode="contained" onPress={() => signOut()}>
        {t('sign_out')}
      </Button>
    </Background>
  );
}
