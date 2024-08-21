import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

import Navigation from './Navigation';
import { Themes } from './styles/themes';

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

if (!PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
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
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <PaperProvider theme={Themes}>
          {/* If user is authenticated, then render Navigation otherwise render SignInScreen */}
          <Navigation theme={Themes} />
        </PaperProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
