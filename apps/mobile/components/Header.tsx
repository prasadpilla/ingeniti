import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

interface HeaderProps {
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const theme = useTheme();
  return <Text style={[styles.header, { color: theme.colors.secondary }]}>{children}</Text>;
};

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
  },
});

export default Header;
