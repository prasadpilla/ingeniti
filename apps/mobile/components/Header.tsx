import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Themes } from '../styles/themes';

interface HeaderProps {
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => (
  <Text style={styles.header}>{children}</Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: Themes.colors.secondary,
    fontWeight: 'bold',
    paddingVertical: 14,
  },
});

export default Header;
