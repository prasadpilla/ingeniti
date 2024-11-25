import { useClerk } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Switch, useTheme } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import { useAppTheme } from '../providers/ThemeProvider';

export default function ProfileScreen() {
  const theme = useTheme();
  const { signOut } = useClerk();
  const { t } = useTranslation();
  const { appThemeType, setAppTheme } = useAppTheme();

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

  const toggleTheme = () => {
    setAppTheme(appThemeType === 'light' ? 'dark' : 'light');
  };

  return (
    <Background>
      <View style={styles.headerContainer}>
        <MaterialIcons
          name={appThemeType === 'light' ? 'wb-sunny' : 'nightlight-round'}
          size={24}
          color={theme.colors.primary}
          style={styles.icon}
        />
        <Switch color={theme.colors.primary} value={appThemeType === 'dark'} onValueChange={toggleTheme} />
      </View>
      <Header>{t('profile')}</Header>

      <Button mode="contained" onPress={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? <ActivityIndicator animating={true} color={theme.colors.secondary} /> : t('sign_out')}
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 5,
    position: 'absolute',
    top: 50,
    right: 0,
  },
  icon: {
    marginLeft: 'auto',
  },
});
