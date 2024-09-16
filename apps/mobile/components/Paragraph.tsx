import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Themes } from '../styles/themes';

interface ParagraphProps extends React.ComponentProps<typeof Text> {
  children: React.ReactNode;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, style, ...props }) => (
  <Text style={StyleSheet.compose(styles.text, style)} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 20,
    color: Themes.colors.secondary,
    textAlign: 'center',
  },
});

export default Paragraph;
