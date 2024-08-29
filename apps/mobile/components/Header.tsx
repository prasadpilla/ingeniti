import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Themes } from '../styles/themes';

interface Props {
  children: React.ReactNode;
}

const Header = ({ children }: Props) => <Text style={styles.header}>{children}</Text>;

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: Themes.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 14,
  },
});

export default Header;
