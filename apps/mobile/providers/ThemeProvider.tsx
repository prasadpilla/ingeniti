import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { LightTheme, DarkTheme } from '../styles/themes';

type ThemeContextType = {
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
      const storedTheme = await SecureStore.getItemAsync('appThemeType');
      if (storedTheme) {
        setAppThemeType(storedTheme as 'light' | 'dark' | 'system');
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
    await SecureStore.setItemAsync('appThemeType', newTheme);
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
