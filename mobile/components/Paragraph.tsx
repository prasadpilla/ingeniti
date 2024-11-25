import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ParagraphProps extends React.ComponentProps<typeof Text> {
  children: React.ReactNode;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, style, ...props }) => {
  const theme = useTheme();
  return (
    <Text style={[{ color: theme.colors.secondary }, styles.text, style]} {...props}>
      {children}
    </Text>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default Paragraph;
