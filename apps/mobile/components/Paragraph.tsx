import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Themes } from '../styles/themes';

type Props = React.ComponentProps<typeof Text> & {
  children: React.ReactNode;
};

const Paragraph = ({ children, ...props }: Props) => (
  <Text style={styles.text} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: Themes.colors.secondary,
    textAlign: 'center',
    marginBottom: 14,
  },
});

export default Paragraph;
