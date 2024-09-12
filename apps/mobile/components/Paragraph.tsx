import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Themes } from '../styles/themes';

interface ParagraphProps extends React.ComponentProps<typeof Text> {
  children: React.ReactNode;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, ...props }) => (
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
