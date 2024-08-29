import { useClerk } from '@clerk/clerk-expo';
import React from 'react';
import { Switch } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';

export default function SettingsScreen() {
  const { signOut } = useClerk();

  return (
    <Background>
      <Header>Settings</Header>
      <Switch color="red" value={false} onValueChange={() => {}} />
      <Button mode="contained" onPress={() => signOut()}>
        Sign out
      </Button>
    </Background>
  );
}
