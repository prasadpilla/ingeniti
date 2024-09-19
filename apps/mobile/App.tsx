import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { PaperProvider, useTheme } from 'react-native-paper';

import Navigation from './Navigation';
import { DarkTheme, LightTheme, Themes } from './styles/themes';
import { useColorScheme } from 'react-native';

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <PaperProvider theme={colorScheme === 'dark' ? DarkTheme : LightTheme}>
          <Navigation theme={Themes} />
        </PaperProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
function useMaterial3Theme(): { theme: any } {
  throw new Error('Function not implemented.');
}
