import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, useTheme } from 'react-native-paper';

interface ButtonProps extends React.ComponentProps<typeof PaperButton> {}

const Button: React.FC<ButtonProps> = ({ mode, style, children, ...props }) => {
  const theme = useTheme();

  return (
    <PaperButton
      style={[style, styles.button, mode === 'outlined' && { backgroundColor: theme.colors.primary }]}
      labelStyle={[styles.text, mode === 'outlined' && { color: theme.colors.onPrimary }]}
      mode={mode}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 26,
  },
});

export default Button;
