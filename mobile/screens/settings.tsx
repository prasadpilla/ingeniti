import { ThemeContext } from 'context/theme-context';
import React from 'react';
import { Text, View } from 'react-native';
import { Switch } from 'react-native-paper';

export default function SettingsScreen() {
  const { toggleTheme, isThemeDark } = React.useContext(ThemeContext);
  return (
    <View>
      <Text>Settings</Text>
      <Switch color="red" value={isThemeDark} onValueChange={toggleTheme} />
    </View>
  );
}
