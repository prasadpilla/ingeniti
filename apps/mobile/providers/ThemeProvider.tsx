import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { DarkTheme, LightTheme } from '../styles/themes';

export type ThemeContextType = {
  appTheme: typeof LightTheme | typeof DarkTheme;
  setAppTheme: (theme: 'light' | 'dark' | 'system') => void;
  appThemeType: 'light' | 'dark' | 'system';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [appThemeType, setAppThemeType] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        if (Platform.OS !== 'web') {
          const storedTheme = await SecureStore.getItemAsync('appThemeType');
          if (storedTheme) {
            setAppThemeType(storedTheme as 'light' | 'dark' | 'system');
          }
        } else {
          const storedTheme = localStorage.getItem('appThemeType');
          if (storedTheme) {
            setAppThemeType(storedTheme as 'light' | 'dark' | 'system');
          }
        }
      } catch (error) {
        console.error('Error loading theme from storage', error);
      }
    };

    loadTheme();
  }, []);

  const appTheme =
    appThemeType === 'system'
      ? colorScheme === 'dark'
        ? DarkTheme
        : LightTheme
      : appThemeType === 'dark'
        ? DarkTheme
        : LightTheme;

  const setAppTheme = async (newTheme: 'light' | 'dark' | 'system') => {
    setAppThemeType(newTheme);
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('appThemeType', newTheme);
      } else {
        localStorage.setItem('appThemeType', newTheme);
      }
    } catch (error) {
      console.error('Error saving theme to storage', error);
    }
  };

  useEffect(() => {
    if (appThemeType === 'system') {
      setAppThemeType('system');
    }
  }, [colorScheme]);

  return <ThemeContext.Provider value={{ appTheme, setAppTheme, appThemeType }}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
